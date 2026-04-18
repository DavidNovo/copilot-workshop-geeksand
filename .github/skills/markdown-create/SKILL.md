# Markdown Document Creation Skill

This skill provides comprehensive guidance for creating well-formatted markdown documents following markdownlint v0.40.0 standards. Use this skill whenever creating or editing markdown files to ensure consistent, high-quality formatting.

## Quick Reference: Key Formatting Rules

### Headings (MD001, MD003, MD018-023, MD025-026)
- **Heading Hierarchy**: Headings must increment by only one level at a time (e.g., H1 → H2, not H1 → H3)
- **Consistent Heading Style**: Use ATX style headings (`# Heading`) consistently throughout the document
- **Spacing After Hash**: Include exactly one space between `#` symbols and heading text
  - ✅ `# Heading` 
  - ❌ `#Heading` or `#  Heading`
- **Blank Lines Around Headings**: Surround all headings with blank lines (except at document start/end)
  - ✅ Text before heading\n\n# Heading\n\nText after
  - ❌ Text before heading\n# Heading\nText after
- **Single Top-Level Heading**: A document should have only one H1 heading (MD025)
- **No Trailing Punctuation**: Headings should not end with punctuation marks (MD026)
  - ✅ `# My Heading`
  - ❌ `# My Heading.`

### Blank Lines (MD012, MD022, MD031-032, MD047, MD058)
- **Single Blank Lines**: Use only 1 blank line between sections (max 1 consecutive blank line)
- **Headings Need Blank Lines**: All headings must have blank lines above and below
- **Code Blocks Need Blank Lines**: Fenced code blocks must be surrounded by blank lines
- **Lists Need Blank Lines**: Unordered and ordered lists must be surrounded by blank lines
- **Tables Need Blank Lines**: Tables must be surrounded by blank lines
- **Single Trailing Newline**: Files must end with exactly one newline character (MD047)

### Lists (MD004-005, MD007, MD029-030)
- **Consistent List Markers**: Use the same marker style throughout (all `*`, all `-`, or all `+`)
  - ✅ `* Item 1\n* Item 2\n* Item 3`
  - ❌ `* Item 1\n+ Item 2\n- Item 3`
- **Consistent Indentation**: Nested lists must use consistent indentation (default: 2 spaces per level)
  - ✅ `* Item 1\n  * Nested Item 1`
  - ❌ `* Item 1\n   * Nested Item 1`
- **List Item Indentation**: Indent nested lists by exactly 2 spaces (MD007)
- **Ordered Lists**: Use sequential numbering (`1.`, `2.`, `3.`) or consistent style (all `1.`, all `0.`)
- **Space After List Marker**: Include exactly 1 space after list markers
  - ✅ `* Item` or `1. Item`
  - ❌ `*Item` or `1.Item`

### Code Formatting (MD010, MD014, MD040, MD046, MD048)
- **No Hard Tabs**: Use spaces instead of tabs for indentation
- **Fenced Code Blocks**: Use consistent fence style (backticks ``` or tildes ~~~)
  - ✅ All backticks or all tildes throughout document
  - ❌ Mix of backticks and tildes
- **Language Specifiers**: Always include a language identifier on code fences
  - ✅ ` ```javascript\ncode\n``` `
  - ❌ ` ```\ncode\n``` `
- **Consistent Code Block Style**: Use either all fenced code blocks or all indented code blocks, not both
- **Blank Lines Around Code Blocks**: Surround fenced code blocks with blank lines
- **No Dollar Signs Without Output**: Don't use `$` in shell code blocks unless showing output
  - ✅ `ls\nfoo bar` (output follows)
  - ❌ `$ ls` (no output shown)

### Whitespace (MD009, MD010, MD019-021, MD027, MD037-039)
- **No Trailing Spaces**: Remove all trailing whitespace at line ends
- **No Hard Tabs**: Replace tabs with spaces (1 tab = 1 space by default)
- **Single Space After Heading Hashes**: Multiple spaces after `#` are not allowed
  - ✅ `# Heading`
  - ❌ `#  Heading`
- **Single Space in Blockquotes**: Use exactly 1 space after `>` in blockquotes
  - ✅ `> Quote`
  - ❌ `>  Quote` or `>Quote`
- **No Spaces in Emphasis**: Don't add spaces inside emphasis markers
  - ✅ `**bold**` or `*italic*`
  - ❌ `** bold **` or `* italic *`
- **No Spaces in Code Spans**: Trim unnecessary spaces in inline code
  - ✅ `` `code` ``
  - ❌ `` ` code ` `` (single leading/trailing space allowed by spec)
- **No Spaces in Links**: Don't add spaces inside link brackets
  - ✅ `[link text](url)`
  - ❌ `[ link text ](url)`

### Links & URLs (MD011, MD034, MD042, MD051-055, MD059)
- **Correct Link Syntax**: Use `[text](url)` format, not reversed `(text)[url]`
- **Angle Brackets for URLs**: Wrap bare URLs in angle brackets
  - ✅ `<https://example.com>`
  - ❌ `https://example.com`
- **No Empty Links**: All links must have destinations
  - ✅ `[link](https://example.com)`
  - ❌ `[link]()`
- **Valid Fragment References**: Link fragments must match existing heading anchors
  - ✅ `[Link to Section](#section-heading)`
  - ❌ `[Link](#nonexistent)`
- **Descriptive Link Text**: Use meaningful link text, not generic phrases
  - ✅ `[Download the budget document](url)`
  - ❌ `[click here](url)` or `[link](url)`
- **Reference Links Must Be Used**: Remove unused link/image reference definitions

### Blockquotes (MD027-028)
- **Single Space After `>`**: Use exactly 1 space after blockquote symbol
  - ✅ `> Quote text`
  - ❌ `>  Quote text` or `>Quote text`
- **No Blank Lines Between**: Avoid blank lines between blockquotes (or repeat `>` on blank line)
  - ✅ `> Quote\n> \n> Continued`
  - ❌ `> Quote\n\n> Different quote` (may merge)

### Emphasis (MD036, MD049-050)
- **Use Headings Not Emphasis**: Don't use bold/italic for section headers
  - ✅ `# Section`
  - ❌ `**Section**`
- **Consistent Emphasis Style**: Use asterisks (`*`, `**`) or underscores (`_`, `__`), not both
  - ✅ All `*text*` and `**bold**`
  - ❌ Mix of `*text*` and `_text_`
- **Asterisks for Inline Emphasis**: Underscores for words containing internal underscores
  - ✅ `like*this*one` (inside words)
  - ❌ `like_this_one`

### Tables (MD055-056, MD058, MD060)
- **Consistent Pipe Style**: Use consistent leading/trailing pipes `|` in all table rows
- **Matching Column Counts**: Every row must have the same number of cells
- **Blank Lines Around Tables**: Surround tables with blank lines
- **Aligned Delimiters**: Ensure pipe characters align vertically for readability
  - ✅ Properly aligned pipe characters
  - ❌ Misaligned pipes

### Line Length (MD013)
- **Maximum Line Length**: Keep lines to 80 characters max (exceptions for URLs and links without spaces)
- **Code Blocks**: Code blocks should also respect the 80-character limit
- **Long URLs**: URLs without spaces are exempt from length restrictions

### HTML & Special Content (MD033, MD041, MD045)
- **Avoid Inline HTML**: Use pure Markdown, not raw HTML
  - ✅ `# Heading`
  - ❌ `<h1>Heading</h1>`
- **First Line Must Be Heading**: Document should start with a top-level heading (MD041)
  - ✅ `# Document Title\n\nContent...`
  - ❌ `Some introduction\n# Document Title`
- **Images Need Alt Text**: All images must have alternative text (MD045)
  - ✅ `![Alt text describing image](image.jpg)`
  - ❌ `![](image.jpg)`

### Horizontal Rules (MD035)
- **Consistent HR Style**: Use the same horizontal rule style throughout
  - ✅ All `---` or all `***` or all `___`
  - ❌ Mix of styles

## Best Practices for Markdown Creation

### Document Structure
1. Start with exactly one H1 heading (document title)
2. Use H2 for major sections
3. Use H3+ for subsections
4. Maintain logical hierarchy without skipping levels
5. End file with exactly one newline character

### Readability
1. Keep paragraphs concise
2. Use lists for related items
3. Use code blocks for examples
4. Add blank lines between sections
5. Use emphasis sparingly and purposefully

### Content Guidelines
1. Write descriptive link text
2. Always provide alt text for images
3. Include language specifiers in code blocks
4. Use consistent terminology throughout
5. Verify all cross-references and links are valid

### Example Structure
```markdown
# Document Title

Introductory paragraph explaining the purpose of this document.

## Section One

Description of section one.

### Subsection

More details here.

## Section Two

Content for section two.

- List item 1
- List item 2

## Examples

Example code with language specified:

```python
def hello():
    print("Hello, World!")
```

## Related Links

- [Link to resource](https://example.com)
- [Another resource](https://example.com/resource)
```

## Using markdownlint to Validate

Run markdownlint on your document to check compliance:

```bash
# Install markdownlint (CLI)
npm install -g markdownlint-cli

# Validate a file
markdownlint filename.md

# Validate with specific rules
markdownlint --rules MD001,MD003 filename.md

# Fix issues automatically
markdownlint --fix filename.md
```

## Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| `#Heading` | No space after hash | Use `# Heading` |
| Multiple blank lines | Clutter | Use max 1 blank line |
| Inconsistent lists | Confusion | Use same marker throughout |
| Mixed code fence styles | Inconsistent | Use ``` or ~~~ consistently |
| Missing alt text on images | Accessibility issue | Add descriptive alt text |
| Trailing whitespace | Hidden errors | Remove spaces at line end |
| Reversed link syntax | Broken links | Use `[text](url)` not `(text)[url]` |
| Hard tabs | Rendering issues | Replace with spaces |
| Bare URLs | May not link | Wrap in angle brackets `<url>` |
| Skipped heading levels | Broken structure | Increment by 1 level only |

## Summary Checklist

Before publishing, verify:

- [ ] Document starts with a single H1 heading
- [ ] Heading levels increment by 1 (no skipping)
- [ ] All headings use consistent style (ATX with single space)
- [ ] Blank lines surround all headings, lists, and code blocks
- [ ] No trailing whitespace
- [ ] No hard tabs (spaces only)
- [ ] Consistent list marker style
- [ ] All code blocks have language specifiers
- [ ] All images have alt text
- [ ] All links have descriptive text
- [ ] Tables have consistent pipe alignment
- [ ] File ends with single newline
- [ ] Line length ≤ 80 characters (except URLs)
- [ ] No inline HTML (unless necessary)
- [ ] All emphasis is consistent (asterisks or underscores, not mixed)

---

**Reference**: [markdownlint v0.40.0 Rules Documentation](https://github.com/DavidAnson/markdownlint/tree/v0.40.0/doc)
