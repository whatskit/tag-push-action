# @whatskit/tag-push-action

## About

Github action to retag and push multiplatform images to multiple registries

## Usage

### Basic

```yaml
name: Push-Image

on: push

jobs:
  push-image:
    runs-on: ubuntu-latest
    steps:

      - name: Login Quay
        uses: docker/login-action@v1
        with:
          registry: 'quay.io'
          username: ${{ secrets.QUAY_USERNAME }}
          password: ${{ secrets.QUAY_TOKEN }}

      - name: Login Dockerhub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Push image
        uses: whatskit/tag-push-action@v1
        with:
          src: docker.io/whatskit/node-disk-manager:ci
          dst: |
            quay.io/whatskit/node-disk-manager-amd64:ci
```

1. Login to all the registries from which you want to pull and push the multiplatform image.


2. Specify the `src` and `dst` registry, both of which are mandatory fields. The action allows multiple destination registries specified as a yaml string.

**NOTE: If dockerhub is used, make sure that `docker.io` is specified in the image name**

### Using with `docker/metadata-action`

The action can be used alongside [metadata-action](https://github.com/docker/metadata-action) to generate
tags easily.

```yaml
name: Push-Image

on: push

jobs:
  push-image:
    runs-on: ubuntu-latest
    steps:

      - name: Login Dockerhub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v3
        with:
          images: docker.io/whatskit/node-disk-manager     

      - name: Push image
        uses: whatskit/tag-push-action@v1
        with:
          src: docker.io/whatskit/node-disk-manager:ci
          dst: |
            ${{ steps.meta.outputs.tags }}
```

The output tags from the `meta` step can be used as destination tags for this github action.

### Use a custom docker config file

The standard docker config path on GitHub runner is `/home/runner/.docker/config.json`. In case you're running on a custom GitHub runner, and your config path is not standard, then the `docker-config-path` can be used.

```yaml
  - name: Push image
    uses: whatskit/tag-push-action@v1
    with:
      docker-config-path: /home/myuser/.docker/config.json
      src: docker.io/whatskit/node-disk-manager:ci
      dst: |
        quay.io/whatskit/node-disk-manager-amd64:ci
```
