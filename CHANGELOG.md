# 6.0.0 (2024-02-06)


### Bug Fixes

* **#234:** do not set empty github-token as secret ([16957fa](https://github.com/TriPSs/conventional-changelog-action/commit/16957fa56f7333a3cb494b260c53708481eb5197)), closes [#234](https://github.com/TriPSs/conventional-changelog-action/issues/234)
* **#234:** extend information how to use Deploy Key to trigger on push tag workflows ([0674827](https://github.com/TriPSs/conventional-changelog-action/commit/0674827a3df59dd5cf698c35ccbb9441865fb504)), closes [#234](https://github.com/TriPSs/conventional-changelog-action/issues/234)
* Add global unhandledRejection handler ([0600ca1](https://github.com/TriPSs/conventional-changelog-action/commit/0600ca1902042ed6a922d78a40b180eadc546142))
* Add pre-changelog-generation input in README ([46a1a68](https://github.com/TriPSs/conventional-changelog-action/commit/46a1a68683081dbea9a2545e842caf17bf0ddab1))
* add testcase for new + pre-release ([fc4c16d](https://github.com/TriPSs/conventional-changelog-action/commit/fc4c16dd9b531599647b491bd1bbb118f6cd24c6))
* bad reference ([a19765d](https://github.com/TriPSs/conventional-changelog-action/commit/a19765d093dc22d5007a1574c6db5d40be9ddf97))
* Changed yarn --prod to npm ci --prod ([5ba044f](https://github.com/TriPSs/conventional-changelog-action/commit/5ba044f581579411517848e186a425258f30556a))
* Check if repo is shallow before unshallowing ([c5bb2b1](https://github.com/TriPSs/conventional-changelog-action/commit/c5bb2b18afb00739c65c2bee9fc9bb6da52a8c90))
* Downgraded the conventional packages ([052fce1](https://github.com/TriPSs/conventional-changelog-action/commit/052fce1f3fc33b9194f6e7ea5793691128ee732b))
* Empty version files ([091fdfc](https://github.com/TriPSs/conventional-changelog-action/commit/091fdfc6a55a151e3adff5ada382986ead85d58e))
* execute git config commands synchronously ([1607ac7](https://github.com/TriPSs/conventional-changelog-action/commit/1607ac70d5942487fb67e1d412d57868d8decca9))
* fail action on push rejection ([206a4e3](https://github.com/TriPSs/conventional-changelog-action/commit/206a4e313a58d868e56629ca59a29a5d8e0105ea))
* Fixed awaits missing ([35206c5](https://github.com/TriPSs/conventional-changelog-action/commit/35206c51048844fb3e645398b5c9a0f692f8bb56))
* Fixed ci and removed node_modules ([c2f6f9a](https://github.com/TriPSs/conventional-changelog-action/commit/c2f6f9ae3055a752fd6437121bbffc4434354e1a))
* Fixed command output empty ([b985fd6](https://github.com/TriPSs/conventional-changelog-action/commit/b985fd640ab6d046da88a5817b9f3437d67696f5))
* Fixed git being called incorrectly ([6bfb377](https://github.com/TriPSs/conventional-changelog-action/commit/6bfb377c32c27e881a77139109c1d40afed12415))
* Fixed isShallow not working correctly anymore ([d68d2f2](https://github.com/TriPSs/conventional-changelog-action/commit/d68d2f2010d17f69267400f329baee761a8e8428))
* Fixed name action.yml ([70ed437](https://github.com/TriPSs/conventional-changelog-action/commit/70ed437cb42d5ad01303d98797a7988fe1266f6b))
* Fixed silent git errors [#74](https://github.com/TriPSs/conventional-changelog-action/issues/74) ([7c35f3c](https://github.com/TriPSs/conventional-changelog-action/commit/7c35f3c2863828a71323a49e16c5542c789591f9))
* Fixed tagPrefix being provided as context instead of option ([e66c42b](https://github.com/TriPSs/conventional-changelog-action/commit/e66c42b7603eadc663e120f1355b7da328301ece))
* Fixed tagPrefix not being provided to bumper ([5b65653](https://github.com/TriPSs/conventional-changelog-action/commit/5b65653fe8cedf1219e523bf44ee0a7453dcc8d2))
* Fixed that bumping multiple files with same extension type did only update one ([62453ed](https://github.com/TriPSs/conventional-changelog-action/commit/62453ed268eb6e82fcaf11351ce4cdd4f4b323aa))
* Fixed that fs was undefined ([f330c69](https://github.com/TriPSs/conventional-changelog-action/commit/f330c69c10a12faa1919e691a71fbdda3b3ba238))
* Fixes ([f467ea7](https://github.com/TriPSs/conventional-changelog-action/commit/f467ea783254be918b70be58fa1aca0ab0c9ac80))
* Fixes for CI ([b0698e5](https://github.com/TriPSs/conventional-changelog-action/commit/b0698e5e9b298cc4a6d95889e38638d8d6fd35fa))
* Fixes for CI ([093fc9c](https://github.com/TriPSs/conventional-changelog-action/commit/093fc9c7c21c99f362e43df6c572f02b0bf6fc8e))
* Fixes for pre changelog generation ([484cf10](https://github.com/TriPSs/conventional-changelog-action/commit/484cf104714fbe499d83bd2818038e8c14e8ce98))
* honour pre-release flag for default version ([e63e00c](https://github.com/TriPSs/conventional-changelog-action/commit/e63e00c563bd7191db28f0e8c5308adc2bd840c6))
* Make sure the angular preset is loaded ([2b646ec](https://github.com/TriPSs/conventional-changelog-action/commit/2b646ec8807a2e493c68cab23071c47d385acbd6))
* Message when using the fallback version ([b525f9a](https://github.com/TriPSs/conventional-changelog-action/commit/b525f9ae66cb03aa2a58cd043963504b911bac31))
* More checks. Fix test for changelog generation ([c6043fb](https://github.com/TriPSs/conventional-changelog-action/commit/c6043fb4f9cc46d59dea99e88ebae07976b3a87f))
* Only run ci on PRs to master ([9f0d3d7](https://github.com/TriPSs/conventional-changelog-action/commit/9f0d3d7508a2dd13f6289944ddae48aca0510d6d))
* output current version if there is no new ver ([b1e290f](https://github.com/TriPSs/conventional-changelog-action/commit/b1e290f44d9e4e0a29d536146cf1fb073172cf9d))
* Pull all tags ([3396dfc](https://github.com/TriPSs/conventional-changelog-action/commit/3396dfc4323e48de090308fff522ef4c557f73e5))
* Pull full history so it works with checkout@v2 ([50ab4fa](https://github.com/TriPSs/conventional-changelog-action/commit/50ab4fa80a641d1a198fb5fe17536a5db6a39a3a))
* Redeploy with src/action again ([8977e61](https://github.com/TriPSs/conventional-changelog-action/commit/8977e6168a89eec51d459921bc0a85f7aaa494c6))
* Reformat code so we can release ([0ba6821](https://github.com/TriPSs/conventional-changelog-action/commit/0ba68212f41940954beb406ee679b4e89c792a3a))
* Release with all deps ([2b36c79](https://github.com/TriPSs/conventional-changelog-action/commit/2b36c79d01330e9272a6f28e9f019a7c6203425e))
* Remove node_modules and ignore folder ([3ed803a](https://github.com/TriPSs/conventional-changelog-action/commit/3ed803a60bcddc0bf9a18d441c3a1c52bdab2477))
* remove prefix from git-branch parameter ([ed8c9f5](https://github.com/TriPSs/conventional-changelog-action/commit/ed8c9f5217f4f759142cc4f425583a5530aa3370))
* Remove unneded import. More precise path for requiring hooks ([040d8e9](https://github.com/TriPSs/conventional-changelog-action/commit/040d8e90f4548fdebc6fe291763582d202c62e88))
* Removed node_modules so rerelease could add them again ([1bac915](https://github.com/TriPSs/conventional-changelog-action/commit/1bac915367fb7a9aef99bf8df172e524b4614909))
* Retry again with the node_modules ([949ce5e](https://github.com/TriPSs/conventional-changelog-action/commit/949ce5e5a6447f5232585b381468821acbf713f2))
* Show info if the version couldn't be detected ([9a324db](https://github.com/TriPSs/conventional-changelog-action/commit/9a324dbd51d0d32c1b9df1a291e14cc20a5bbaff))
* simplify logic fallback version logic, remove default from action.yaml ([ecddc26](https://github.com/TriPSs/conventional-changelog-action/commit/ecddc262291a3d768c04c52d31af23d1cf2e6d84))
* Tag name can also be changed in pre-changelog-generation ([c0f4172](https://github.com/TriPSs/conventional-changelog-action/commit/c0f41727e6b6df5561d358a6bb0aaded9c25da61))
* Test name ([f66f6a2](https://github.com/TriPSs/conventional-changelog-action/commit/f66f6a29a71c9b5ee636cef9ee022f127da37304))
* Test release ([7fe9b66](https://github.com/TriPSs/conventional-changelog-action/commit/7fe9b661515076d5b01caf208e48d85e63c060a5))
* Test release ([fd60d38](https://github.com/TriPSs/conventional-changelog-action/commit/fd60d3839eb39542e4bc8c56a3a33aa41f25247a))
* Test release ([7365edf](https://github.com/TriPSs/conventional-changelog-action/commit/7365edf6f58d23baf8383668f83170dcb46bf5e6))
* Test release ([d0cd7bf](https://github.com/TriPSs/conventional-changelog-action/commit/d0cd7bf31f1a8e24ef4d44422d3fb9a4c694c89a))
* Test release ([37217f5](https://github.com/TriPSs/conventional-changelog-action/commit/37217f530cbbb866612b86d6c8a27d068d16e652))
* Test release ([1f63990](https://github.com/TriPSs/conventional-changelog-action/commit/1f63990fabc8bbf5d7cf9b234a4eb75c350518c3))
* Test release ([57d7d45](https://github.com/TriPSs/conventional-changelog-action/commit/57d7d4594f47d66d8de3eb1b7f4207130a7697ac))
* Test release ([c8e9ea6](https://github.com/TriPSs/conventional-changelog-action/commit/c8e9ea6338b809f0b2fb3b4e0ce037d7b26d7325))
* Test release ([a85634b](https://github.com/TriPSs/conventional-changelog-action/commit/a85634b8c7dc152dc1cf027ba5a91df6634f9ef2))
* Test release ([234446d](https://github.com/TriPSs/conventional-changelog-action/commit/234446dc90c9969a41a3bd97841e47adf81b50ee))
* Test release ([ab2ea09](https://github.com/TriPSs/conventional-changelog-action/commit/ab2ea0974adb27fd4e2bb45fd21e51b2c8181c27))
* Test release ([7cbbde6](https://github.com/TriPSs/conventional-changelog-action/commit/7cbbde6d9f2fc92e95b50eb8474ed08437ffe6f3))
* Test release ([9d10bb2](https://github.com/TriPSs/conventional-changelog-action/commit/9d10bb22adb57a2b4953272c7a938af9ab4f301b))
* Try again with different node_modules ([9378b30](https://github.com/TriPSs/conventional-changelog-action/commit/9378b3051abbd2f793956f852cdc7bac0fea7d9c))
* Updated `@actions/core` ([e36f42c](https://github.com/TriPSs/conventional-changelog-action/commit/e36f42c737692496073caba5e3f3a473226ce270)), closes [#182](https://github.com/TriPSs/conventional-changelog-action/issues/182)
* Use `getBooleanInput` for boolean values ([ae32d56](https://github.com/TriPSs/conventional-changelog-action/commit/ae32d567b6902c5fd23868ef5717c1d5127fe06a)), closes [#161](https://github.com/TriPSs/conventional-changelog-action/issues/161)
* Use fallback if it's not a valid JSON-File ([97f1bb3](https://github.com/TriPSs/conventional-changelog-action/commit/97f1bb3543e6f2480ef3e699fc695ecb8b3f881b))


### chore

* Updated deps ([0c8b645](https://github.com/TriPSs/conventional-changelog-action/commit/0c8b64523693b1868ab3e85385e70d3702849680))


### Code Refactoring

* Changed int 5 to string 5 as default value ([b7d2808](https://github.com/TriPSs/conventional-changelog-action/commit/b7d28084e6d04b3b171793bfb8b28e47efb23025))


### Documentation

* Updated README ([000434c](https://github.com/TriPSs/conventional-changelog-action/commit/000434c4469403159c004a4ed0f5715a06f80448))


### Features

* add  option to customize the pushed branch ([2a7cc0e](https://github.com/TriPSs/conventional-changelog-action/commit/2a7cc0e9fbcbe6b93a27411f1e194c331dc98a6b))
* Add 'infile' option ([a858fad](https://github.com/TriPSs/conventional-changelog-action/commit/a858fade68261d33b8c91977bbe3c77f1d39521d))
* add [skip ci] by default to commit message ([a0bcde8](https://github.com/TriPSs/conventional-changelog-action/commit/a0bcde8dcf6c731817d1142609d778fd4367ae05))
* Add `git-path` option ([96b4f2c](https://github.com/TriPSs/conventional-changelog-action/commit/96b4f2ca996f2193165c87e184b8a765102c814c)), closes [#178](https://github.com/TriPSs/conventional-changelog-action/issues/178)
* Add fallback version ([63d0e46](https://github.com/TriPSs/conventional-changelog-action/commit/63d0e46a0b69e3db3f7a5f44e963323afc35d29c))
* Add pre-commit script file (hook) ([0aa82ce](https://github.com/TriPSs/conventional-changelog-action/commit/0aa82ce2ad5a23a200c8ce1eeba32eaefc846d9a))
* Add pre-release support ([14cc315](https://github.com/TriPSs/conventional-changelog-action/commit/14cc315abe788497f54c3eb3c734963ffbf6cc3e))
* add skip-on-empty feature ([153f866](https://github.com/TriPSs/conventional-changelog-action/commit/153f866251ba4d7c33881dbf082bb1e17974e2a1))
* add skip-tag to skip tagging a release ([22e862a](https://github.com/TriPSs/conventional-changelog-action/commit/22e862a0ab69410642c4182cd9ee27a23d8c63a0))
* Added  option ([d9201c2](https://github.com/TriPSs/conventional-changelog-action/commit/d9201c2107f9c691396768f75fe261ad3588b413))
* Added 'multiple-files' test workflow ([bb40f54](https://github.com/TriPSs/conventional-changelog-action/commit/bb40f54b50fdae3a1a084b597370e7e0f95c28ab))
* Added `create-summary` option that adds the changelog as Action summary ([38e51f4](https://github.com/TriPSs/conventional-changelog-action/commit/38e51f47d7298945df398f8d89bf474ff1198df3))
* Added `git-push` option to skip pushing git changes ([9b90fb3](https://github.com/TriPSs/conventional-changelog-action/commit/9b90fb3eeafcfac330320d99235c4462cd7c7614))
* Added `old_version` output ([3ca6919](https://github.com/TriPSs/conventional-changelog-action/commit/3ca6919820fdf15e0dc179c3b992e1587a530e91)), closes [#240](https://github.com/TriPSs/conventional-changelog-action/issues/240)
* Added clean_changelog option ([7684c0e](https://github.com/TriPSs/conventional-changelog-action/commit/7684c0e755c006004c61d6a6c12e748fee34179d))
* Added more logging ([d46daa9](https://github.com/TriPSs/conventional-changelog-action/commit/d46daa9a537c6d12a6ec4d859e55ef76372a15a8))
* Added outputs ([770b36d](https://github.com/TriPSs/conventional-changelog-action/commit/770b36d584ef48fe4e0ef7d808d18e5cb0031462))
* Added skip commit and skip tag ([3eab241](https://github.com/TriPSs/conventional-changelog-action/commit/3eab2417f9b3e1db3d630b6ec1820106da9a21a9))
* Added support for comma-separated version files ([3ba65fd](https://github.com/TriPSs/conventional-changelog-action/commit/3ba65fd7f7bff6e1c60178d49632067c6a8d6bfa))
* Added support for toml files ([5aff23f](https://github.com/TriPSs/conventional-changelog-action/commit/5aff23f51411f417adf6ea22364d158d335a5fce))
* Added support for yaml files ([bdf8ec0](https://github.com/TriPSs/conventional-changelog-action/commit/bdf8ec04e6f0d493ef859df06ffbeecb1f47a970))
* Added the option to provide the location of the packge.json ([c18a89e](https://github.com/TriPSs/conventional-changelog-action/commit/c18a89eed164e4414b30da38013938f498abef11))
* Added version-file, version-path, skip-version-file options ([d022b0d](https://github.com/TriPSs/conventional-changelog-action/commit/d022b0d7e98b6b13ce0af3e6c44a550256b0ca59))
* Added versioning through GIT ([7143306](https://github.com/TriPSs/conventional-changelog-action/commit/714330612535ae25eb483d0f24fb2fe0c091dc86))
* Allow to specify a config file ([f0fabf6](https://github.com/TriPSs/conventional-changelog-action/commit/f0fabf6d88a3b7cef366530cc9cad6160a00d128))
* Allow to specify custom tags which override auto generated ones ([8f6aa19](https://github.com/TriPSs/conventional-changelog-action/commit/8f6aa1969f7dd949c0b8c6456c792fa55dd21ce5))
* elixir support ([e669b12](https://github.com/TriPSs/conventional-changelog-action/commit/e669b12b9395bcb967ca5674c03ed7d6364ce675))
* Include `conventionalcommits` in pre-compiled presets ([f56dffa](https://github.com/TriPSs/conventional-changelog-action/commit/f56dffaed0e9d183ad37733b382170cb3f9457a4)), closes [#246](https://github.com/TriPSs/conventional-changelog-action/issues/246)
* Make the releaseCount configurable ([da75f59](https://github.com/TriPSs/conventional-changelog-action/commit/da75f5939add67131c5c804a1e2973ba6667957b))
* More git configurations are possible ([9ee9c27](https://github.com/TriPSs/conventional-changelog-action/commit/9ee9c274488b9013bf3dd5e5a1f9af3345901f7e))
* **pre-commit:** Allow relative path for the pre-commit input ([afea49f](https://github.com/TriPSs/conventional-changelog-action/commit/afea49fa57e678f9c8117d73415a488600b3cd28))
* Test release ([c471392](https://github.com/TriPSs/conventional-changelog-action/commit/c47139231d3289a08ee39c0b1978b9e935d456a5))
* Test release ([d71558c](https://github.com/TriPSs/conventional-changelog-action/commit/d71558cec69d773fb6846734b57ff55a6d7b3648))
* Test release ([5945aae](https://github.com/TriPSs/conventional-changelog-action/commit/5945aaed8f5e59d227742dd35670381cf444aa93))
* Update action to node 16 ([08c1b12](https://github.com/TriPSs/conventional-changelog-action/commit/08c1b1237bb2dbed93fa7ecba9c334f094cb6b0b))
* Update action to run on `node20` ([97da0e7](https://github.com/TriPSs/conventional-changelog-action/commit/97da0e72a97bc87383ea2a36c83309d0401ef751))
* Updated deps ([c1f5d34](https://github.com/TriPSs/conventional-changelog-action/commit/c1f5d3424bf4057d0df64fa2f91d5f83413cfb02)), closes [#166](https://github.com/TriPSs/conventional-changelog-action/issues/166)
* use default GitHub token as default token ([d1907da](https://github.com/TriPSs/conventional-changelog-action/commit/d1907daae2d8e03d0a63daec2099349817a4a1fc))
* use same permissions used at repo checkout ([c82c3a1](https://github.com/TriPSs/conventional-changelog-action/commit/c82c3a1b1de521412af47239e9d46a2c49e7c8c7)), closes [#115](https://github.com/TriPSs/conventional-changelog-action/issues/115)
* **yml:** Added support for no quotes and double quotes ([2a80eb3](https://github.com/TriPSs/conventional-changelog-action/commit/2a80eb3e4a1914fcd08a6ae083fa7a94c94d8137))


### BREAKING CHANGES

* Updated major version of packages
* Updated `conventional-changelog` to v4 and `conventional-recommended-bump` to v7
* `package-json` is now renamed to `version-file`
* Changed changelog-release-count to release-count



