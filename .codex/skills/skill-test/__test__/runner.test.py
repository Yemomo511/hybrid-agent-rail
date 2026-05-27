#!/usr/bin/env python3
import os
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
RUNNER = REPO_ROOT / ".codex" / "skills" / "skill-test" / "scripts" / "run_skill_test.py"


class SkillTestRunnerTest(unittest.TestCase):
    def make_skill(self, root: Path, name: str = "demo-skill") -> Path:
        skill_dir = root / name
        skill_dir.mkdir(parents=True)
        skill_dir.joinpath("SKILL.md").write_text(
            textwrap.dedent(
                f"""\
                ---
                name: {name}
                description: Demo skill for runner tests.
                ---

                ## Demo Skill

                ## Overview

                Helps an agent answer questions and perform actions.

                ## When To Invoke

                - When the user asks about demo behavior.

                ## Workflow

                1. Inspect the target project.
                2. Answer or make the smallest requested change.
                """
            ),
            encoding="utf-8",
        )
        return skill_dir

    def make_fake_coco(self, root: Path) -> tuple[Path, Path]:
        bin_dir = root / "bin"
        bin_dir.mkdir()
        log_path = root / "coco.log"
        fake_coco = bin_dir / "coco"
        fake_coco.write_text(
            textwrap.dedent(
                f"""\
                #!/usr/bin/env bash
                printf 'PWD=%s\\nPROMPT=%s\\n---\\n' "$PWD" "$1" >> "{log_path}"
                printf 'fake coco handled: %s\\n' "$1"
                """
            ),
            encoding="utf-8",
        )
        fake_coco.chmod(0o755)
        return bin_dir, log_path

    def run_runner(self, args: list[str], fake_bin: Path, cwd: Path) -> subprocess.CompletedProcess[str]:
        env = os.environ.copy()
        env["PATH"] = f"{fake_bin}{os.pathsep}{env.get('PATH', '')}"
        return subprocess.run(
            ["python3", str(RUNNER), *args],
            cwd=cwd,
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

    def test_default_run_generates_isolated_prompts_and_report(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            target_cwd = tmp_path / "target-project"
            target_cwd.mkdir()
            resolved_target_cwd = target_cwd.resolve()
            skill_dir = self.make_skill(tmp_path)
            fake_bin, coco_log = self.make_fake_coco(tmp_path)

            result = self.run_runner(
                ["--skill", str(skill_dir), "--cwd", str(target_cwd)],
                fake_bin,
                tmp_path,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(".test/test-report/demo-skill/", result.stdout)

            report_files = list((target_cwd / ".test" / "test-report" / "demo-skill").glob("*/report.md"))
            self.assertEqual(len(report_files), 1)
            report = report_files[0].read_text(encoding="utf-8")

            self.assertIn("# Skill Test Report", report)
            self.assertIn("待测 Skill 名称: `demo-skill`", report)
            self.assertIn(f"执行 cwd: `{resolved_target_cwd}`", report)
            self.assertIn("问题解答", report)
            self.assertIn("简单操作", report)
            self.assertIn("复杂操作", report)
            self.assertIn("退出状态: 0", report)
            self.assertIn("## 观察到的问题", report)
            self.assertIn("## 最小化修改建议", report)

            log = coco_log.read_text(encoding="utf-8")
            self.assertEqual(log.count("PROMPT="), 5)
            self.assertEqual(log.count(f"PWD={resolved_target_cwd}"), 5)
            self.assertIn("读取`demo-skill`,其位于", log)
            self.assertIn("testpath/demo-skill/SKILL.md", log)

            isolated_skill = next((target_cwd / ".test" / "skill-test-work" / "demo-skill").glob("*/testpath/demo-skill/SKILL.md"))
            self.assertTrue(isolated_skill.exists())

    def test_custom_prompt_records_type_content_and_coco_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            target_cwd = tmp_path / "target-project"
            target_cwd.mkdir()
            skill_file = self.make_skill(tmp_path).joinpath("SKILL.md")
            fake_bin, _ = self.make_fake_coco(tmp_path)
            failing_coco = fake_bin / "coco"
            failing_coco.write_text(
                "#!/usr/bin/env bash\nprintf 'custom failure\\n' >&2\nexit 7\n",
                encoding="utf-8",
            )
            failing_coco.chmod(0o755)

            result = self.run_runner(
                [
                    "--skill",
                    str(skill_file),
                    "--cwd",
                    str(target_cwd),
                    "--prompt",
                    "复杂操作::请根据目标项目上下文执行一次复杂评测",
                ],
                fake_bin,
                tmp_path,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            report_file = next((target_cwd / ".test" / "test-report" / "demo-skill").glob("*/report.md"))
            report = report_file.read_text(encoding="utf-8")

            self.assertIn("复杂操作", report)
            self.assertIn("请根据目标项目上下文执行一次复杂评测", report)
            self.assertIn("退出状态: 7", report)
            self.assertIn("custom failure", report)


if __name__ == "__main__":
    unittest.main()
