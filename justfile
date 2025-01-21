
petalVersion := "-petal.1"

# This help
help:
  just --list --unsorted

# Publish the packages in the Petalhealth scope
publish:
  #!/usr/bin/env bash

  # We need to remove the publish config from the package.json
  package_jsons=$(find ./packages -name "package.json" | grep -v node_modules)

  for package_json in ${package_jsons}; do
    # We need to remove the publish config from the package.json
    jq '. | del(.publishConfig)' ${package_json} > ${package_json}.updated
    # We will patch the version with our pre release tag
    version=$(jq -r '.version' ${package_json})
    jq --arg version "${version}{{petalVersion}}" '.version=$version' ${package_json}.updated > ${package_json}
    rm ${package_json}.updated
  done

  # We will push to https://gitlab.com/petalhealth/platform/doc-as-code/document-package (65553429)
  # @markdown-confluence:registry=https://gitlab.com/api/v4/projects/65553429/packages/npm/

  npm publish --scope @petalhealth -w @markdown-confluence/lib
  npm publish --scope @petalhealth -w @markdown-confluence/mermaid-electron-renderer
  npm publish --scope @petalhealth -w @markdown-confluence/mermaid-puppeteer-renderer
  npm publish --scope @petalhealth -w @markdown-confluence/cli

  for package_json in ${package_jsons}; do
    git checkout ${package_json}
  done
