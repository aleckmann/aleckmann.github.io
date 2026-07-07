# Personal Website

This repository contains the source code for my personal website, built using [Hugo](https://gohugo.io/), a fast and modern static site generator.

## Project Structure

- `archetypes/` - Contains default content templates
- `assets/` - Contains CSS, images, and YAML files
  - `css/` - Custom CSS styles
  - `img/` - Image assets
  - `yml/` - Resume YAML configurations
- `config/` - Hugo configuration files
- `content/` - Website content
  - `posts/` - Blog posts
  - `resume/` - Resume section
- `layouts/` - Custom Hugo templates
- `public/` - Generated static site files
- `static/` - Static assets that are copied directly to public
- `themes/` - Hugo themes

## Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (Extended version)
- Go (for Go modules)
- Node.js 24 and npm (for resume PDF rendering)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/aleckmann/aleckmann.github.io.git
cd aleckmann.github.io
```

2. Start the Hugo development server:
```bash
hugo server -D
```

The site will be available at `http://localhost:1313/`

### Building

To build the static site:
```bash
hugo
```

The generated site will be in the `public/` directory.

## Features

- Responsive design
- Blog functionality
- Resume section with YAML-based data
- Custom CSS styling
- Multiple language support configuration
- Optimized images and assets

## Resume Generation

The resume on this site uses one YAML data source and one Hugo rendering path. Hugo renders the HTML resume, and CI prints that rendered page to PDF with Playwright/Chromium.

### Resume Configuration

- The resume data is stored in `assets/yml/aleckmann-resume.yml`
- This YAML file contains structured data about work experience, education, skills, and other resume sections

### Local PDF Rendering

Build a local copy of the site with a loopback base URL, then print the resume page to PDF:

```bash
npm ci
npx playwright install chromium
hugo --destination /tmp/aleckmann-resume-render --cleanDestinationDir --baseURL http://127.0.0.1:4173/
npm run resume:pdf -- --site-dir /tmp/aleckmann-resume-render --output public/resume/aleckmann-resume.pdf --port 4173
```

### GitHub Actions Workflow

When changes are pushed to the main branch, the GitHub Actions workflow:
1. Reads the YAML resume file
2. Builds the Hugo site normally for GitHub Pages
3. Builds a second temporary copy with a local loopback base URL
4. Prints the temporary `/resume/` page to `public/resume/aleckmann-resume.pdf`
5. Uploads the static site artifact to GitHub Pages

### Accessing the Resume

- The final PDF resume is available in the resume section of the website
- The resume data is also rendered in HTML format at the `/resume` route
- The checked-in PDF under `content/resume/` is a fallback; CI overwrites the published PDF during deployment

### Rendering Engine

- one rendering engine for HTML and PDF
- CSS customization without separate PDF template constraints
- deterministic local and CI rendering from the same built page
- one pinned Node dev dependency

The tradeoff is that CI installs Chromium for PDF generation, which is heavier than keeping a static PDF or using an already-packaged resume Docker image.

## Deployment

This site is deployed using GitHub Pages. Any changes pushed to the main branch will automatically trigger a deployment.

## License

[MIT License](LICENSE)
