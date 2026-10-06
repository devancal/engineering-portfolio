# Devan Calabrese — Engineering Portfolio

Mechanical Engineering at Ohio State. CAD assemblies, motion studies, engineering computation and autonomous racing experiments for Summer 2027 internship applications.

[Live portfolio](https://engineering-portfolio-nu.vercel.app/)

## Develop

Node 22+; no npm runtime dependencies or secrets.

```sh
npm run build
npm test
python -m http.server 8000
```

Edit `content/home.html`, `content/projects.json`, and the case-study HTML in `content/`, then build and commit generated pages. Vercel serves clean project URLs; a basic local server uses their `.html` paths.

See [HANDOFF.md](HANDOFF.md) for architecture, content updates, evidence limitations, asset needs and verification details.

The actual GLB models and résumé remain in the repository. CAD viewers load automatically as they approach the viewport; static project content works without JavaScript.
