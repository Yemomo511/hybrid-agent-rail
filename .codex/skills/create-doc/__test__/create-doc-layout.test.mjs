import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = resolve(import.meta.dirname, '../../../..');
const validateScript = join(repoRoot, '.codex/skills/create-doc/validate.mjs');
const knowledgeScript = join(repoRoot, '.codex/skills/create-doc/validate-knowlegdge.mjs');

const createDocContent = () => `---
name: document-system-contract
description: 说明 Hybrid Agent Rail 文档系统的写入边界、索引规则和校验要求。
keywords: 文档系统, 文档治理, KNOWLEDGE, create-doc, 防止漂移
doc_type: contract
source_path: docs/AGENTS.md, .codex/skills/create-doc
---
# Document System Contract

## Purpose
说明长期文档应该记录什么、如何进入索引、如何校验。

## Applies To
- 当新增、修改或删除 docs 下的长期文档时。

## Content
文档正文固定放在 docs/document-system-contract/doc.md。

## Update When
- 文档系统路径规则变化时。
`;

const createKnowledgeContent = (linkPath) => `## Knowledge
项目的所有知识库。

## Source

- [Document System Contract](${linkPath})
  - name: document-system-contract
  - description: 说明 Hybrid Agent Rail 文档系统的写入边界、索引规则和校验要求。
  - keywords: 文档系统, 文档治理, KNOWLEDGE, create-doc, 防止漂移
  - doc_type: contract
`;

const createFixture = ({ linkPath = 'document-system-contract/doc.md' } = {}) => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'create-doc-layout-'));
  const flatDocPath = join(fixtureRoot, 'docs', 'document-system-contract.md');
  mkdirSync(join(fixtureRoot, 'docs/document-system-contract'), { recursive: true });
  writeFileSync(join(fixtureRoot, 'docs/document-system-contract/doc.md'), createDocContent());
  writeFileSync(flatDocPath, createDocContent());
  writeFileSync(join(fixtureRoot, 'docs/KNOWLEDGE.md'), createKnowledgeContent(linkPath));
  return fixtureRoot;
};

const runNode = (cwd, script, args = []) =>
  spawnSync(process.execPath, [script, ...args], {
    cwd,
    encoding: 'utf8',
  });

test('document validator rejects governed docs stored as docs/<name>.md', () => {
  const fixtureRoot = createFixture();
  const flatDocumentPath = ['docs', 'document-system-contract.md'].join('/');
  const result = runNode(fixtureRoot, validateScript, [flatDocumentPath]);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /docs\/<name>\/doc\.md/);
});

test('document validator accepts governed docs stored as docs/<name>/doc.md', () => {
  const fixtureRoot = createFixture();
  const result = runNode(fixtureRoot, validateScript, ['docs/document-system-contract/doc.md']);

  assert.equal(result.status, 0, result.stderr);
});

test('knowledge validator rejects Source links that still target docs/<name>.md', () => {
  const flatLinkTarget = 'document-system-contract' + '.md';
  const fixtureRoot = createFixture({ linkPath: flatLinkTarget });
  const result = runNode(fixtureRoot, knowledgeScript, ['docs/document-system-contract/doc.md']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /<name>\/doc\.md/);
});

test('knowledge validator requires Source link to match the document path', () => {
  const fixtureRoot = createFixture({ linkPath: 'other-contract/doc.md' });
  const result = runNode(fixtureRoot, knowledgeScript, ['docs/document-system-contract/doc.md']);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /docs\/document-system-contract\/doc\.md/);
});
