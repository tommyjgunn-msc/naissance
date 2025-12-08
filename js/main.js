/**
 * naissance magazine
 * story loader and renderer
 * 
 * loads stories from markdown files in /issues/issue-one/
 * parses frontmatter for metadata and renders content
 */

// configuration for issues
const ISSUES = {
  'issue-one': {
    name: 'emergence',
    description: 'stories of beginnings, of becoming, of the tender violence of birth',
    stories: [
      'the-weight-of-wings.md',
      'first-light.md',
      'what-the-river-remembers.md',
      'small-gods.md',
      'the-naming.md',
      'pulse.md'
    ]
  }
};

// simple markdown parser (basic implementation)
function parseMarkdown(text) {
  // convert headers
  text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // convert bold and italic
  text = text.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // convert line breaks to paragraphs
  const paragraphs = text.split(/\n\n+/);
  text = paragraphs
    .filter(p => p.trim())
    .map(p => {
      // don't wrap if already has block element
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
  
  return text;
}

// parse frontmatter from markdown file
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const frontmatter = match[1];
  const body = match[2];
  
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      metadata[key] = value;
    }
  });
  
  return { metadata, content: body };
}

// load a single story
async function loadStory(issuePath, filename) {
  try {
    const response = await fetch(`issues/${issuePath}/${filename}`);
    if (!response.ok) throw new Error(`Failed to load ${filename}`);
    
    const text = await response.text();
    const { metadata, content } = parseFrontmatter(text);
    
    // extract first paragraph as excerpt
    const firstParagraph = content.split(/\n\n/)[0] || '';
    const excerpt = firstParagraph.slice(0, 200).trim() + '...';
    
    return {
      filename,
      title: metadata.title || filename.replace('.md', '').replace(/-/g, ' '),
      author: metadata.author || 'anonymous',
      genre: metadata.genre || 'fiction',
      excerpt: excerpt.replace(/[#*_]/g, ''),
      content: parseMarkdown(content)
    };
  } catch (error) {
    console.error(`Error loading story ${filename}:`, error);
    return null;
  }
}

// load all stories for an issue
async function loadIssue(issueId) {
  const issue = ISSUES[issueId];
  if (!issue) {
    console.error(`Issue ${issueId} not found`);
    return [];
  }
  
  const stories = await Promise.all(
    issue.stories.map(filename => loadStory(issueId, filename))
  );
  
  return stories.filter(story => story !== null);
}

// render story cards
function renderStoryCards(stories, container) {
  container.innerHTML = '';
  
  stories.forEach((story, index) => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.setAttribute('data-story-index', index);
    
    card.innerHTML = `
      <span class="story-genre">${story.genre}</span>
      <h3 class="story-title">${story.title}</h3>
      <span class="story-author">by ${story.author}</span>
      <p class="story-excerpt">${story.excerpt}</p>
    `;
    
    card.addEventListener('click', () => openStory(story));
    container.appendChild(card);
  });
}

// open story reader
function openStory(story) {
  const reader = document.getElementById('story-reader');
  const title = document.getElementById('story-reader-title');
  const author = document.getElementById('story-reader-author');
  const content = document.getElementById('story-reader-content');
  
  title.textContent = story.title;
  author.textContent = `by ${story.author}`;
  content.innerHTML = story.content;
  
  reader.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // scroll to top of reader
  reader.scrollTop = 0;
}

// close story reader
function closeStory() {
  const reader = document.getElementById('story-reader');
  reader.classList.remove('active');
  document.body.style.overflow = '';
}

// initialize the issue page
async function initIssuePage() {
  const container = document.getElementById('stories-container');
  if (!container) return;
  
  // show loading state
  container.innerHTML = '<p style="text-align: center; font-family: var(--font-mono); font-size: 0.8rem; text-transform: lowercase; letter-spacing: 0.1em; color: var(--text-light); grid-column: 1 / -1;">loading stories...</p>';
  
  const stories = await loadIssue('issue-one');
  
  if (stories.length === 0) {
    container.innerHTML = '<p style="text-align: center; font-family: var(--font-mono); font-size: 0.8rem; text-transform: lowercase; letter-spacing: 0.1em; color: var(--text-light); grid-column: 1 / -1;">no stories found</p>';
    return;
  }
  
  renderStoryCards(stories, container);
}

// keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStory();
  }
});

// initialize on page load
document.addEventListener('DOMContentLoaded', initIssuePage);
