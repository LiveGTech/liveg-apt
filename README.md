# LiveG APT Repository
Our Debian APT repository for storing and distributing custom packages.

Licensed by the [LiveG Open-Source Licence](LICENCE.md), except where otherwise noted.

For more information about the packages stored in this APT repo, [visit the repo's main page](https://opensource.liveg.tech/liveg-apt).

## Adding this repo to APT
To add this repo to APT so that you can install its packages, run the following commands:

```bash
curl -s --compressed https://opensource.liveg.tech/liveg-apt/KEY.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/liveg-apt.gpg > /dev/null
sudo curl -s --compressed https://opensource.liveg.tech/liveg-apt/liveg-apt.list -o /etc/apt/sources.list.d/liveg-apt.list
sudo apt update
```

You should then be able to `apt install` any packages in this repo. Try installing `liveg-hello` and running `liveg-hello` to see if the LiveG APT Repository has been added correctly.

## Updating this repo's metadata
To update the metadata for this repo, you will need the GPG keychain for `hi@liveg.tech`. With this keychain, run:

```bash
tools/update.sh
```

## Building a package in the `sources` directory
To build a package included in the `sources` directory, run:

```bash
tools/buildsource.sh $PACKAGE_NAME
```

Where `$PACKAGE_NAME` is the name of the package in the `sources` directory to build for. This will also update the repo's metadata.
