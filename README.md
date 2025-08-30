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

The resume on this site is generated from a YAML file using the YAML Resume workflow. Here's how it works:

### Resume Configuration

- The resume data is stored in `assets/yml/aleckmann-resume.yml`
- This YAML file contains structured data about work experience, education, skills, and other resume sections
- An example template can be found at `assets/yml/exampleresume.yml`

### GitHub Actions Workflow

When changes are pushed to the main branch, the GitHub Actions workflow:
1. Reads the YAML resume file
2. Processes it using [YAML Resume](https://github.com/yamlresume/yamlresume), an open-source tool for generating resumes from YAML
3. Generates a PDF version of the resume
4. Places the generated PDF in the `resume/` directory

### Accessing the Resume

- The final PDF resume is available in the resume section of the website
- The resume data is also rendered in HTML format at the `/resume` route
- The YAML source can be used to generate different formats or styles of the resume

### Attribution

This project uses [YAML Resume](https://github.com/yamlresume/yamlresume) for converting the YAML resume data into a downloadable PDF. YAML Resume is an open-source project that provides a powerful and flexible way to maintain your resume as code.

## Deployment

This site is deployed using GitHub Pages. Any changes pushed to the main branch will automatically trigger a deployment.

## License

[MIT License](LICENSE)
