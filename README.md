# naissance

a literary magazine dedicated to publishing fiction, poetry, and creative nonfiction that captures moments of transformation.

## structure

```
naissance/
├── index.html          # landing page
├── about.html          # about, issues, masthead, submissions, contact
├── contributors.html   # contributor bios and photos
├── issue.html          # issue one display page
├── css/
│   └── styles.css      # all styles
├── js/
│   └── main.js         # markdown loader and story reader
├── images/
│   └── contributors/   # contributor photos (add as needed)
└── issues/
    └── issue-one/      # markdown files for issue one stories
        ├── the-weight-of-wings.md
        ├── first-light.md
        ├── what-the-river-remembers.md
        ├── small-gods.md
        ├── the-naming.md
        └── pulse.md
```

## adding a new story

1. create a new `.md` file in the appropriate issue folder (e.g., `issues/issue-one/`)
2. add frontmatter at the top of the file:

```markdown
---
title: your story title
author: author name
genre: fiction | poetry | creative nonfiction
---

your story content here...
```

3. add the filename to the `ISSUES` configuration in `js/main.js`:

```javascript
const ISSUES = {
  'issue-one': {
    name: 'emergence',
    description: 'stories of beginnings...',
    stories: [
      'existing-story.md',
      'your-new-story.md'  // add here
    ]
  }
};
```

## adding a new issue

1. create a new folder in `issues/` (e.g., `issues/issue-two/`)
2. add story markdown files to that folder
3. add the issue configuration to `js/main.js`:

```javascript
const ISSUES = {
  'issue-one': { ... },
  'issue-two': {
    name: 'your theme',
    description: 'your description',
    stories: ['story1.md', 'story2.md']
  }
};
```

4. create a new issue page (copy `issue.html` and update the issue ID)

## adding contributor photos

1. add photos to `images/contributors/`
2. update `contributors.html` to reference the photo:

```html
<img src="images/contributors/author-name.jpg" class="contributor-photo" alt="author name">
```

recommended: 300x300px, square crop, jpg format

## adding issue cover images

1. add cover images to `images/`
2. update `about.html` to reference the cover:

```html
<img src="images/issue-one-cover.jpg" class="issue-cover" alt="issue one cover">
```

## deployment

### github pages

1. push to github
2. go to repository settings → pages
3. select branch and save

### vercel

1. connect github repository to vercel
2. vercel will auto-detect and deploy as static site
3. no configuration needed

## tech

- pure html/css/javascript
- no build step required
- markdown parsing done client-side
- fonts: cormorant garamond + space mono (google fonts)

## license

content © naissance magazine. code available for adaptation.
