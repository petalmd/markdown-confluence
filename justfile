
# This help
help:
  just --list --unsorted

# Publish the packages in the Petalhealth scope
publish:
  #!/usr/bin/env bash

  # We need to remove the publish config from the package.json
  package_jsons=$(find ./packages -name "package.json" | grep -v node_modules)

  for package_json in ${package_jsons}; do
    jq '. | del(.publishConfig)' ${package_json} > ${package_json}.updated
    mv ${package_json}.updated ${package_json}
  done

  npm publish --scope @petalhealth -w @markdown-confluence/lib
  npm publish --scope @petalhealth -w @markdown-confluence/mermaid-electron-renderer
  npm publish --scope @petalhealth -w @markdown-confluence/mermaid-puppeteer-renderer
  npm publish --scope @petalhealth -w @markdown-confluence/cli
