# Admin Portal

## GCP deployment

```
    DISCLAIMER: Don't delete any .yaml file in `ethera/` directory on GCP
```

* First clone the `repo`
* change directory to that specific repo
* run the below commands one by one
```bash
    $ node -v
    $ nvm install 16.19.0
    $ yarn <or> npm install
```

* After node modules install for the first time, there will be an error in the `scss` file of `node_modules`, you can fix it as follows
* you can skip the below command if you aren't installing the `node_modules`
```bash
    $ vim node_modules/bootstrap/scss/_function.scss
```

* the above command will open an editor, where you will have to put percentage sign `%` at line `195` after the digit `100`, => it should be `100%`

* After that you can save the file by pressing `Esc`, and then `:wq` to write and quit

```bash
    $ yarn build <or> npm run build
```

* After build, move the `build` to `ethera/`
* there will be three directories and three `.yaml` files each for respective portal
* admin portal has `admin.yaml` file, provider has `provider.yaml` file and client portal has `app.yaml` file

### `Deploying Client Portal`
```bash
    $ rm -rf client
    $ mv build/ client/
    $ gcloud app deploy
```

### `Deploying Provider Portal`
```bash
    $ rm -rf provider
    $ mv build/ provider/
    $ gcloud app deploy provider.yaml
```

### `Deploying Admin Portal`
```bash
    $ rm -rf admin
    $ mv build/ admin/
    $ gcloud app deploy admin.yaml
```
