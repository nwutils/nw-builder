# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/) using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Since `v4.6.0`, we have switched to automated releases and this file does not need to be manually updated.

## [4.17.0](https://github.com/nwutils/nw-builder/compare/v4.16.2...v4.17.0) (2026-01-03)


### Features

* **util:** support local files for options.manifestUrl ([#1494](https://github.com/nwutils/nw-builder/issues/1494)) ([5d77ea1](https://github.com/nwutils/nw-builder/commit/5d77ea197faebb94bd7be718dd19084d91e5aa25)), closes [#1490](https://github.com/nwutils/nw-builder/issues/1490)


### Chores

* **deps-dev:** bump globals from 16.5.0 to 17.0.0 in the npm group ([#1495](https://github.com/nwutils/nw-builder/issues/1495)) ([c816533](https://github.com/nwutils/nw-builder/commit/c81653370892017f60f56cc4d321c3ce79176563))
* **deps:** bump the gha group in /.github/workflows with 2 updates ([#1492](https://github.com/nwutils/nw-builder/issues/1492)) ([23327e5](https://github.com/nwutils/nw-builder/commit/23327e5a99e492e9f679b9f335d781290a04c936))

## [4.16.2](https://github.com/nwutils/nw-builder/compare/v4.16.1...v4.16.2) (2025-12-28)


### Bug Fixes

* **ci:** integrate OIDC with Release Please Action ([ffc0057](https://github.com/nwutils/nw-builder/commit/ffc00578e57632caebe2e7dfcc0d0dc372d400e4))


### Chores

* **docs:** remove rebuilding native addons instructions ([05095fc](https://github.com/nwutils/nw-builder/commit/05095fc2fa82337beff62b42d92a13859e36b0f0))

## [4.16.1](https://github.com/nwutils/nw-builder/compare/v4.16.0...v4.16.1) (2025-12-27)


### Bug Fixes

* **cli:** handle options.shaSum properly ([#1489](https://github.com/nwutils/nw-builder/issues/1489)) ([8a4d2c7](https://github.com/nwutils/nw-builder/commit/8a4d2c7b52c04a2f20ae66efb34974bb6b51af1d)), closes [#1488](https://github.com/nwutils/nw-builder/issues/1488)
* **deps:** upgrade Vitest ([b1d8cf5](https://github.com/nwutils/nw-builder/commit/b1d8cf56d949e748a3dc531a814de838562b66fc))


### Chores

* **ci:** switch to npm oidc ([5ca9dfa](https://github.com/nwutils/nw-builder/commit/5ca9dfa673aa1e753f7c2cefb21bab295b23d86f))
* **deps-dev:** bump js-yaml from 4.1.0 to 4.1.1 ([#1473](https://github.com/nwutils/nw-builder/issues/1473)) ([8f52716](https://github.com/nwutils/nw-builder/commit/8f52716bc955b5239bd1a187186db132213f597e))
* **deps-dev:** bump nw from 0.104.0 to 0.104.1 in the npm-nw group ([#1462](https://github.com/nwutils/nw-builder/issues/1462)) ([4262a62](https://github.com/nwutils/nw-builder/commit/4262a62e74e4468638407c1d11cce0169f15b860))
* **deps:** bump glob ([#1478](https://github.com/nwutils/nw-builder/issues/1478)) ([8e58d6a](https://github.com/nwutils/nw-builder/commit/8e58d6a0b66674a79f6ce351b5d83a359bb23afe))
* **deps:** bump tar from 7.5.1 to 7.5.2 ([#1474](https://github.com/nwutils/nw-builder/issues/1474)) ([e8150e6](https://github.com/nwutils/nw-builder/commit/e8150e6898fdb639b8ac1df77f6637d7da0b3dcd))
* **deps:** bump the gha group across 1 directory with 3 updates ([#1477](https://github.com/nwutils/nw-builder/issues/1477)) ([f13e5ee](https://github.com/nwutils/nw-builder/commit/f13e5eeb816769283657faa6111d91a1a2c6ddd5))
* **deps:** bump the gha group across 1 directory with 3 updates ([#1487](https://github.com/nwutils/nw-builder/issues/1487)) ([3f111c9](https://github.com/nwutils/nw-builder/commit/3f111c97e2ab6c4895caf125d066a815b59a9889))
* **deps:** bump the npm group across 1 directory with 13 updates ([#1485](https://github.com/nwutils/nw-builder/issues/1485)) ([5d6163c](https://github.com/nwutils/nw-builder/commit/5d6163c082e63c3a8dcd6395cf13a3723aed8022))
* **deps:** bump vite from 7.0.2 to 7.1.5 in the npm_and_yarn group across 1 directory ([#1451](https://github.com/nwutils/nw-builder/issues/1451)) ([9b985e2](https://github.com/nwutils/nw-builder/commit/9b985e26537f99d0466255e900bd820a295037f2))
* **deps:** remove unused dependency semver ([f420a1a](https://github.com/nwutils/nw-builder/commit/f420a1a28cc48f0b010ef735b0f506b410184f43))
* git ignore tarballs ([e77f7cd](https://github.com/nwutils/nw-builder/commit/e77f7cd8512141553348e0e57111c9c71cc43e22))
* remove node-gyp and related ([ea181c4](https://github.com/nwutils/nw-builder/commit/ea181c4ed0d8847a76276fd8746a6af38efa6297))

## [4.16.0](https://github.com/nwutils/nw-builder/compare/v4.15.0...v4.16.0) (2025-10-05)


### Features

* **deps:** NW.js 0.103.0, Node v24.5.0, npm v11.5.2 ([#1446](https://github.com/nwutils/nw-builder/issues/1446)) ([b9e2e37](https://github.com/nwutils/nw-builder/commit/b9e2e3710eb16f61993c0d1d0722d039f0714984))
* **deps:** NW.js v0.104.0, Node v24.7.0, npm v11.6.1 ([#1449](https://github.com/nwutils/nw-builder/issues/1449)) ([eeb39bf](https://github.com/nwutils/nw-builder/commit/eeb39bff7c90b8edfcb8d1ec92283ddbc2944702))


### Bug Fixes

* **util:** parse options.managedManifest correctly ([d3ae0da](https://github.com/nwutils/nw-builder/commit/d3ae0daf2893ff3b547b21b692f2f10abc8513aa))


### Chores

* **deps:** bump actions ([83c1df4](https://github.com/nwutils/nw-builder/commit/83c1df4ff708d5811a0031673ab0c937731bf34a))
* **deps:** bump actions/setup-node from 4.4.0 to 5.0.0 in /.github/workflows in the gha group ([#1447](https://github.com/nwutils/nw-builder/issues/1447)) ([7c50902](https://github.com/nwutils/nw-builder/commit/7c50902e52d45909bf8daa5162626cbdbf1dfe24))
* **deps:** bump googleapis/release-please-action from 4.2.0 to 4.3.0 in /.github/workflows in the gha group ([#1442](https://github.com/nwutils/nw-builder/issues/1442)) ([1cab1a8](https://github.com/nwutils/nw-builder/commit/1cab1a846f4d2c7f7580179ff13c0e9b429839c8))
* **deps:** bump the npm-all group across 1 directory with 4 updates ([#1443](https://github.com/nwutils/nw-builder/issues/1443)) ([124d8fb](https://github.com/nwutils/nw-builder/commit/124d8fb773cf7e4c862a62d336b076e345b6c2d0))
* **deps:** bump the npm-all group across 1 directory with 4 updates ([#1448](https://github.com/nwutils/nw-builder/issues/1448)) ([8053fe1](https://github.com/nwutils/nw-builder/commit/8053fe19d280fbe2d4e36499f3ec936881e3fd65))
* **deps:** bump the npm-all group across 1 directory with 8 updates ([#1458](https://github.com/nwutils/nw-builder/issues/1458)) ([a3e2afa](https://github.com/nwutils/nw-builder/commit/a3e2afab544d8bd6660d425835bddba2f7e8b5f9))

## [4.15.0](https://github.com/nwutils/nw-builder/compare/v4.14.2...v4.15.0) (2025-08-16)


### Features

* **deps:** NW.js v0.102.1, Node v24.5.0, npm v11.5.2 ([#1439](https://github.com/nwutils/nw-builder/issues/1439)) ([11b7240](https://github.com/nwutils/nw-builder/commit/11b72404322a5c122742fc597ce4594ad3e0ce7c))


### Chores

* **deps-dev:** bump the npm-all group across 1 directory with 4 updates ([#1438](https://github.com/nwutils/nw-builder/issues/1438)) ([c1a5660](https://github.com/nwutils/nw-builder/commit/c1a5660f64c05086f705f5fe27cd8caa484afff9))
* **deps:** bump actions/checkout from 4.2.2 to 5.0.0 in /.github/workflows in the gha group ([#1436](https://github.com/nwutils/nw-builder/issues/1436)) ([ac79b8b](https://github.com/nwutils/nw-builder/commit/ac79b8bbe47a7da16f0e5e52d403f2c1d1ade1b4))

## [4.14.2](https://github.com/nwutils/nw-builder/compare/v4.14.1...v4.14.2) (2025-08-10)


### Bug Fixes

* **util:** add default value for Exec in Desktop Entry file ([#1434](https://github.com/nwutils/nw-builder/issues/1434)) ([0b7f75a](https://github.com/nwutils/nw-builder/commit/0b7f75aef5b0049131489c8e29a67c0fad5ddd0e)), closes [#1433](https://github.com/nwutils/nw-builder/issues/1433)
* **util:** remove path.resolve for options.app.icon ([#1432](https://github.com/nwutils/nw-builder/issues/1432)) ([bf7be13](https://github.com/nwutils/nw-builder/commit/bf7be13aa55bf192f55272e3801e1cb26171cc1a))


### Chores

* **deps-dev:** bump eslint-plugin-jsdoc from 52.0.2 to 52.0.4 in the npm-all group ([#1427](https://github.com/nwutils/nw-builder/issues/1427)) ([6efefe7](https://github.com/nwutils/nw-builder/commit/6efefe7a9eb8aea5a2534330e07814590a4b8bce))

## [4.14.1](https://github.com/nwutils/nw-builder/compare/v4.14.0...v4.14.1) (2025-08-06)


### Bug Fixes

* **cli:** parse argument as srcDir option ([#1425](https://github.com/nwutils/nw-builder/issues/1425)) ([8483dd4](https://github.com/nwutils/nw-builder/commit/8483dd4576268d213ce8ab492ee46573213c725e)), closes [#1424](https://github.com/nwutils/nw-builder/issues/1424)
* **deps:** security update for tmp ([#1426](https://github.com/nwutils/nw-builder/issues/1426)) ([106d545](https://github.com/nwutils/nw-builder/commit/106d545611a25e6a6e6057bdb641107c18d6703f))

## [4.14.0](https://github.com/nwutils/nw-builder/compare/v4.13.16...v4.14.0) (2025-08-03)


### Features

* **deps:** NW.js v102, Node v24.3.0, npm v11.5.2 ([1971786](https://github.com/nwutils/nw-builder/commit/197178680c2c2edefaa9b559b6dc44f8888b07bf))


### Bug Fixes

* **cli:** parse --app.* options ([#1422](https://github.com/nwutils/nw-builder/issues/1422)) ([175a263](https://github.com/nwutils/nw-builder/commit/175a2631fbff392b42f8a5e94d78b4e0c379b6e0)), closes [#1419](https://github.com/nwutils/nw-builder/issues/1419)
* **deps:** security update for braces-expansion ([96f00f4](https://github.com/nwutils/nw-builder/commit/96f00f41c9de2246347d0e2c1c1200c00824f2ec))
* **deps:** security update for form-data ([#1416](https://github.com/nwutils/nw-builder/issues/1416)) ([95fbfa1](https://github.com/nwutils/nw-builder/commit/95fbfa1b1e4cc0b558cee92780bdb887b7505654))


### Chores

* **ci:** enforce excluding nw only ([87ade48](https://github.com/nwutils/nw-builder/commit/87ade48a8c88f3db17f0522f695598f2af186e69))
* **ci:** update nw seperately ([884a07b](https://github.com/nwutils/nw-builder/commit/884a07b1de5d3f5dbbba967245622627e755672d))
* **deps:** bump the npm group across 1 directory with 5 updates ([#1418](https://github.com/nwutils/nw-builder/issues/1418)) ([7675df5](https://github.com/nwutils/nw-builder/commit/7675df55907cbe90adcfe5e3501f0cc7f4ad351f))
* **docs:** update maintainer guidelines ([c364721](https://github.com/nwutils/nw-builder/commit/c3647219414181313db1688018ce9853ebf6041f))

## [4.13.16](https://github.com/nwutils/nw-builder/compare/v4.13.15...v4.13.16) (2025-07-07)


### Bug Fixes

* **util:** update getManifest return type and handle empty response ([#1410](https://github.com/nwutils/nw-builder/issues/1410)) ([c287c07](https://github.com/nwutils/nw-builder/commit/c287c074c7da15b3c62bae3ddc2c9922304b150f))

## [4.13.15](https://github.com/nwutils/nw-builder/compare/v4.13.14...v4.13.15) (2025-07-07)


### Bug Fixes

* update default NW.js version url ([#1412](https://github.com/nwutils/nw-builder/issues/1412)) ([467bab8](https://github.com/nwutils/nw-builder/commit/467bab8bdf51f34447ec80617b905308dc8f6804)), closes [#1411](https://github.com/nwutils/nw-builder/issues/1411)


### Chores

* **ci:** enable continue-on-error for env job ([b6ee211](https://github.com/nwutils/nw-builder/commit/b6ee211518943ce60bdeda85eae3fab0e43b6d20))
* **deps:** bump davelosert/vitest-coverage-report-action from 2.8.2 to 2.8.3 in /.github/workflows in the gha group ([#1398](https://github.com/nwutils/nw-builder/issues/1398)) ([548d0e5](https://github.com/nwutils/nw-builder/commit/548d0e5d09e091ba9eaceaa957dbd49a01becdad))
* **deps:** bump the npm group across 1 directory with 10 updates ([#1409](https://github.com/nwutils/nw-builder/issues/1409)) ([6dd0311](https://github.com/nwutils/nw-builder/commit/6dd0311b1f1c04c1a42534ba9a372b19047b882e))
* **deps:** bump the npm group across 1 directory with 9 updates ([#1404](https://github.com/nwutils/nw-builder/issues/1404)) ([29204c1](https://github.com/nwutils/nw-builder/commit/29204c1849daf0341a226e9cf0d6fac6765a3d68))
* fix linting errors ([a7f57ed](https://github.com/nwutils/nw-builder/commit/a7f57edc281d3fecd18ba81591a12bcf744f3d14))

## [4.13.14](https://github.com/nwutils/nw-builder/compare/v4.13.13...v4.13.14) (2025-05-14)


### Bug Fixes

* **bld:** disable rebuilding Node addons ([464dca2](https://github.com/nwutils/nw-builder/commit/464dca25759c1ae6960977b1e83bdf03b57d2bb2))


### Chores

* **ci:** check for NPM_TOKEN in separate job ([74ca486](https://github.com/nwutils/nw-builder/commit/74ca486a8f8660636e5d17fec9c5ce40e36f9cae))
* **deps:** bump the npm group across 1 directory with 4 updates ([#1394](https://github.com/nwutils/nw-builder/issues/1394)) ([560dd73](https://github.com/nwutils/nw-builder/commit/560dd738162b10555a68109cf146725f821151eb))
* **docs:** clarify addon rebuilding disabled ([bb910e1](https://github.com/nwutils/nw-builder/commit/bb910e193759b6551f1681a5b2da084f9c28be27))
* **docs:** remove mention of rebuilding node addons ([e3ae5b3](https://github.com/nwutils/nw-builder/commit/e3ae5b379e302baa9bbf532d9666ea52dc2639e7))

## [4.13.13](https://github.com/nwutils/nw-builder/compare/v4.13.12...v4.13.13) (2025-05-07)


### Bug Fixes

* **security:** use execFileSync instead of execSync ([48193f0](https://github.com/nwutils/nw-builder/commit/48193f0e14cae4f02a8217df736d056204f446d9))

## [4.13.12](https://github.com/nwutils/nw-builder/compare/v4.13.11...v4.13.12) (2025-05-06)


### Bug Fixes

* **util:** specify default values in CLI invocation ([3b3799d](https://github.com/nwutils/nw-builder/commit/3b3799d6923c3b2a2c361f26978f35dd35d089ac))


### Chores

* **ci:** check if NPM_TOKEN exists as action step ([6b7e64e](https://github.com/nwutils/nw-builder/commit/6b7e64ed100789c314f97cc786ad59fbdff5bca1))
* **ci:** fail if NPM_TOKEN not set ([84484a1](https://github.com/nwutils/nw-builder/commit/84484a1fcd9e307d6225a4b453f778e3f44fd542))
* **ci:** move NPM_TOKEN conditional inside action steps ([ea6ea4c](https://github.com/nwutils/nw-builder/commit/ea6ea4c0d63184822a69ec2627a361892a6121d7))
* **ci:** set continue-on-error to false ([3b9a8a2](https://github.com/nwutils/nw-builder/commit/3b9a8a29030a27fbc4792b367e2c91158b3e60b3))
* **deps:** bump davelosert/vitest-coverage-report-action from 2.8.1 to 2.8.2 in /.github/workflows in the gha group ([#1388](https://github.com/nwutils/nw-builder/issues/1388)) ([7a51dd4](https://github.com/nwutils/nw-builder/commit/7a51dd4fac0c70b8c23f2a345eb130e9e007dc97))
* **deps:** bump the gha group across 1 directory with 2 updates ([#1385](https://github.com/nwutils/nw-builder/issues/1385)) ([2a98e27](https://github.com/nwutils/nw-builder/commit/2a98e27868d149323fa2ef39dd1eeaaad77e464f))
* **deps:** bump the npm group across 1 directory with 6 updates ([#1378](https://github.com/nwutils/nw-builder/issues/1378)) ([5df5c51](https://github.com/nwutils/nw-builder/commit/5df5c51a173d65863544751abda2a1097d9a8225))
* **deps:** bump the npm group across 1 directory with 8 updates ([#1390](https://github.com/nwutils/nw-builder/issues/1390)) ([a5ce5be](https://github.com/nwutils/nw-builder/commit/a5ce5be72cb7ed9c05837ca1f2e40dfc1b81d3af))
* **deps:** bump the npm group across 1 directory with 9 updates ([#1386](https://github.com/nwutils/nw-builder/issues/1386)) ([1f55773](https://github.com/nwutils/nw-builder/commit/1f557731367fa3c3189f3f9a2ac74f19fb378c34))
* **deps:** bump vite from 6.2.2 to 6.2.3 in the npm_and_yarn group ([#1377](https://github.com/nwutils/nw-builder/issues/1377)) ([4f4379d](https://github.com/nwutils/nw-builder/commit/4f4379dd25348cd834df078a970564a114ba5e89))
* **deps:** bump vite from 6.2.3 to 6.2.4 in the npm_and_yarn group ([#1379](https://github.com/nwutils/nw-builder/issues/1379)) ([e425d56](https://github.com/nwutils/nw-builder/commit/e425d563ae37ec2ca6419763e53508337db57d1a))

## [4.13.11](https://github.com/nwutils/nw-builder/compare/v4.13.10...v4.13.11) (2025-03-19)


### Bug Fixes

* **util:** use strict boolean check for glob flag ([63c931d](https://github.com/nwutils/nw-builder/commit/63c931dad34c2b5449c74b540924a91d8ed51685))


### Chores

* **ci:** add concurrency ([41494f5](https://github.com/nwutils/nw-builder/commit/41494f535a583ba2a69daa651b8d1582726a4ad7))
* **ci:** do not run npm publish job if NPM_TOKEN is not available ([e21051c](https://github.com/nwutils/nw-builder/commit/e21051cc8098f12d1006e184108755a88f435517))
* **deps:** bump @babel/runtime from 7.26.0 to 7.26.10 in the npm_and_yarn group ([#1373](https://github.com/nwutils/nw-builder/issues/1373)) ([0b2d34e](https://github.com/nwutils/nw-builder/commit/0b2d34e11d9bf939a9e608bb6ca6415a929457e0))
* **deps:** bump actions/setup-node from 4.2.0 to 4.3.0 in /.github/workflows in the gha group ([#1370](https://github.com/nwutils/nw-builder/issues/1370)) ([5509ca9](https://github.com/nwutils/nw-builder/commit/5509ca93acd5fa68f9e860f1ff3c30d96ea739b1))
* **deps:** bump the npm group across 1 directory with 5 updates ([#1371](https://github.com/nwutils/nw-builder/issues/1371)) ([ba554d2](https://github.com/nwutils/nw-builder/commit/ba554d241e7f3d33c8492b658f4d45f723834fd0))

## [4.13.10](https://github.com/nwutils/nw-builder/compare/v4.13.9...v4.13.10) (2025-03-11)


### Bug Fixes

* **ci:** give release please write permissions ([920e4a0](https://github.com/nwutils/nw-builder/commit/920e4a02863d71d0acac374678d3c017070a1e9f))
* **codeql:** address code scanning alerts ([#1360](https://github.com/nwutils/nw-builder/issues/1360)) ([10cb3ba](https://github.com/nwutils/nw-builder/commit/10cb3baa94803bcf0e119333a0c253e14f8bf00f))


### Chores

* **deps:** bump googleapis/release-please-action from 4.1.4 to 4.2.0 in /.github/workflows in the gha group across 1 directory ([#1364](https://github.com/nwutils/nw-builder/issues/1364)) ([0f28592](https://github.com/nwutils/nw-builder/commit/0f28592f543b62af07b9b4f8aa291712e4e45432))
* **deps:** bump the npm group across 1 directory with 6 updates ([#1368](https://github.com/nwutils/nw-builder/issues/1368)) ([1aaffa5](https://github.com/nwutils/nw-builder/commit/1aaffa5803454e5df17c9d57f4461823f979ea88))

## [4.13.9](https://github.com/nwutils/nw-builder/compare/v4.13.8...v4.13.9) (2025-03-06)


### Bug Fixes

* **get/verify:** use crypto.timingSafeEqual to verify shasums ([3dd449a](https://github.com/nwutils/nw-builder/commit/3dd449aaa55a8f646027f7f454afbe0dc74db35b))


### Chores

* **deps:** bump the gha group across 1 directory with 2 updates ([#1358](https://github.com/nwutils/nw-builder/issues/1358)) ([48e4947](https://github.com/nwutils/nw-builder/commit/48e49474c5aa0c13add585489ae74b6d9adef541))
* **deps:** bump the npm group across 1 directory with 13 updates ([#1357](https://github.com/nwutils/nw-builder/issues/1357)) ([9d3fe0c](https://github.com/nwutils/nw-builder/commit/9d3fe0c95a8209d68055ac25a5f3581c1f6db48a))
* reverse undeprecation of get and run mode ([e139740](https://github.com/nwutils/nw-builder/commit/e1397405929302f07d5bd1bcec913550050c3aa0))

## [4.13.8](https://github.com/nwutils/nw-builder/compare/v4.13.7...v4.13.8) (2025-01-01)


### Bug Fixes

* **bld:** await archiver.finalize ([#1333](https://github.com/nwutils/nw-builder/issues/1333)) ([580668f](https://github.com/nwutils/nw-builder/commit/580668f7a56d050d43078c7e0014eacdc3ee7dfc)), closes [#1328](https://github.com/nwutils/nw-builder/issues/1328)


### Chores

* **deps:** bump the npm group across 1 directory with 11 updates ([#1332](https://github.com/nwutils/nw-builder/issues/1332)) ([b9b96ff](https://github.com/nwutils/nw-builder/commit/b9b96ff565921a518893770996568bb30cee179b))
* **docs:** clarify CJS usage ([d673459](https://github.com/nwutils/nw-builder/commit/d673459141e68a190964c1d4f02203e32296a8b9)), closes [#1331](https://github.com/nwutils/nw-builder/issues/1331)
* **docs:** clarify non-usage of srcDir in CLi interface ([1b61bd1](https://github.com/nwutils/nw-builder/commit/1b61bd1acb58a1ea966bd3606c7d7d7140cfb1d5)), closes [#1330](https://github.com/nwutils/nw-builder/issues/1330)
* **docs:** fix CJS import usage example ([5f323df](https://github.com/nwutils/nw-builder/commit/5f323df441212d495de75a2dceda5031ddce56d5)), closes [#1331](https://github.com/nwutils/nw-builder/issues/1331)
* **test:** download latest NW.js version for Linux demo app ([8c09908](https://github.com/nwutils/nw-builder/commit/8c09908943eba0414b03a7e79c2a87a5f076bfff)), closes [#1324](https://github.com/nwutils/nw-builder/issues/1324)

## [4.13.7](https://github.com/nwutils/nw-builder/compare/v4.13.6...v4.13.7) (2024-11-28)


### Bug Fixes

* **get:** use \s+ to split lines containing shasum info ([64f5709](https://github.com/nwutils/nw-builder/commit/64f5709f230199e3d6a6e837e95ec4e0f74dc806)), closes [#1317](https://github.com/nwutils/nw-builder/issues/1317)

## [4.13.6](https://github.com/nwutils/nw-builder/compare/v4.13.5...v4.13.6) (2024-11-26)


### Bug Fixes

* **bld:** fs.promises.copyFile -&gt; fs.promises.cp ([c1909c7](https://github.com/nwutils/nw-builder/commit/c1909c7d84e1513339625667fc6cab1525677f3b))

## [4.13.5](https://github.com/nwutils/nw-builder/compare/v4.13.4...v4.13.5) (2024-11-26)


### Bug Fixes

* **util:** validate windows options.app.* iff defined ([8a65a6d](https://github.com/nwutils/nw-builder/commit/8a65a6dfc6e3bb16431b81b751140ec7a4056496))

## [4.13.4](https://github.com/nwutils/nw-builder/compare/v4.13.3...v4.13.4) (2024-11-26)


### Bug Fixes

* **util:** validate options.app.company iff defined ([a273e23](https://github.com/nwutils/nw-builder/commit/a273e2335c29922e662b7cc69aeeb0ffe40fba33))

## [4.13.3](https://github.com/nwutils/nw-builder/compare/v4.13.2...v4.13.3) (2024-11-25)


### Bug Fixes

* **bld:** correct fs.promises.copyFile function call ([63fd422](https://github.com/nwutils/nw-builder/commit/63fd422575828dd6be43455e4274abadb4240fbe))

## [4.13.2](https://github.com/nwutils/nw-builder/compare/v4.13.1...v4.13.2) (2024-11-25)


### Bug Fixes

* **bld:** parse options.app.icon correctly during build mode ([bd0ef96](https://github.com/nwutils/nw-builder/commit/bd0ef96f50660be90398e1075434ef003112bbc5))
* **bld:** use fs.promises.copyFile to copy app files in build mode with glob enabled ([e1843f0](https://github.com/nwutils/nw-builder/commit/e1843f00c6f2ec389933565ba0b3975c2c93bc23))

## [4.13.1](https://github.com/nwutils/nw-builder/compare/v4.13.0...v4.13.1) (2024-11-24)


### Bug Fixes

* **run:** return NW.js Node process during run mode from nwbuild function ([fa94df2](https://github.com/nwutils/nw-builder/commit/fa94df284c3e6d23e0efd44d363b71b564cf1f26))
* **types:** correct nwbuild function return type ([b274d27](https://github.com/nwutils/nw-builder/commit/b274d27dbb843b76e26be751249b994f233ac696))

## [4.13.0](https://github.com/nwutils/nw-builder/compare/v4.12.1...v4.13.0) (2024-11-24)


### Features

* **get:** add options.shaSum to enable/disable shasum checks ([#1307](https://github.com/nwutils/nw-builder/issues/1307)) ([98abcaf](https://github.com/nwutils/nw-builder/commit/98abcafeb884a42c34208a6a83f37eb7d518122c))

## [4.12.1](https://github.com/nwutils/nw-builder/compare/v4.12.0...v4.12.1) (2024-11-24)


### Bug Fixes

* **util:** correct Array.isArray usage ([31c4132](https://github.com/nwutils/nw-builder/commit/31c4132bc3313c687f85e7b9ecf2562c483b6639))

## [4.12.0](https://github.com/nwutils/nw-builder/compare/v4.11.6...v4.12.0) (2024-11-21)


### Features

* **run:** return NW.js process reference ([#1304](https://github.com/nwutils/nw-builder/issues/1304)) ([bd2f926](https://github.com/nwutils/nw-builder/commit/bd2f9263d6bf61a98db2e0ec14c5d0ca68aa4b0f))


### Bug Fixes

* miscellaneous quality of life improvements ([#1296](https://github.com/nwutils/nw-builder/issues/1296)) ([a82c140](https://github.com/nwutils/nw-builder/commit/a82c140bd6ebd234dcfe5bb0bff668cfb18d60bc))
* **util:** validate options.* correctly ([#1298](https://github.com/nwutils/nw-builder/issues/1298)) ([3034f5c](https://github.com/nwutils/nw-builder/commit/3034f5cd4214f9b1e4ee5d459a20463eb4d0a50d))
* **util:** validate options.app.* values ([#1302](https://github.com/nwutils/nw-builder/issues/1302)) ([4f388a9](https://github.com/nwutils/nw-builder/commit/4f388a95b3ad634330290ddbc9afca9ab1cda576)), closes [#1279](https://github.com/nwutils/nw-builder/issues/1279) [#1293](https://github.com/nwutils/nw-builder/issues/1293)


### Chores

* **deps-dev:** bump the npm group across 1 directory with 6 updates ([#1301](https://github.com/nwutils/nw-builder/issues/1301)) ([56c1192](https://github.com/nwutils/nw-builder/commit/56c11929d1ae0bce83f4f12ba6fd315d70fd43f3))
* **deps:** bump cross-spawn from 7.0.3 to 7.0.6 ([#1305](https://github.com/nwutils/nw-builder/issues/1305)) ([2803af3](https://github.com/nwutils/nw-builder/commit/2803af3d46ff49bb87487ce3ce59de764ee57cbd))
* **deps:** bump davelosert/vitest-coverage-report-action from 2.6.0 to 2.7.0 in /.github/workflows in the gha group ([#1295](https://github.com/nwutils/nw-builder/issues/1295)) ([23aaad8](https://github.com/nwutils/nw-builder/commit/23aaad85322ac5eb2a3ccb8546a43884c4d89b04))
* **deps:** bump davelosert/vitest-coverage-report-action from 2.7.0 to 2.8.0 in /.github/workflows in the gha group ([#1303](https://github.com/nwutils/nw-builder/issues/1303)) ([ceaf348](https://github.com/nwutils/nw-builder/commit/ceaf348f2d62243576f0c8b6ff57aab1ea1848dc))

## [4.11.6](https://github.com/nwutils/nw-builder/compare/v4.11.5...v4.11.6) (2024-11-01)


### Bug Fixes

* **bld:** set product_string property in manifest to rename MacOS Helper apps ([#1290](https://github.com/nwutils/nw-builder/issues/1290)) ([b1caad7](https://github.com/nwutils/nw-builder/commit/b1caad7343c95f8f37251f3b3132f86adc31f38a)), closes [#1286](https://github.com/nwutils/nw-builder/issues/1286)

## [4.11.5](https://github.com/nwutils/nw-builder/compare/v4.11.4...v4.11.5) (2024-11-01)


### Bug Fixes

* **cli:** handle boolean type options correctly ([#1255](https://github.com/nwutils/nw-builder/issues/1255)) ([524fe34](https://github.com/nwutils/nw-builder/commit/524fe34438493d3aa0f4236741d91462cfb068e3)), closes [#1277](https://github.com/nwutils/nw-builder/issues/1277)


### Chores

* **deps-dev:** bump nw from 0.92.0 to 0.93.0 in the npm group across 1 directory ([#1289](https://github.com/nwutils/nw-builder/issues/1289)) ([ed275ad](https://github.com/nwutils/nw-builder/commit/ed275ad120105d8b5d8f324e97b311c791a92d1a))
* **deps:** bump the gha group across 1 directory with 2 updates ([#1285](https://github.com/nwutils/nw-builder/issues/1285)) ([13081c9](https://github.com/nwutils/nw-builder/commit/13081c918ce2b76cf39a31b8b25ef26e3903f91c))
* **docs:** clarify priority for defined options ([#1281](https://github.com/nwutils/nw-builder/issues/1281)) ([632db41](https://github.com/nwutils/nw-builder/commit/632db4105dd3b205d448c6fe02b26e46167d6549)), closes [#1261](https://github.com/nwutils/nw-builder/issues/1261)
* **docs:** improve terminology ([84fa2a4](https://github.com/nwutils/nw-builder/commit/84fa2a4e55e88e490f46e91dade60e2ab285480b))

## [4.11.4](https://github.com/nwutils/nw-builder/compare/v4.11.3...v4.11.4) (2024-10-13)


### Bug Fixes

* **util:** strip special and control characters from app.name ([#1259](https://github.com/nwutils/nw-builder/issues/1259)) ([b035bc3](https://github.com/nwutils/nw-builder/commit/b035bc3d7393b7ae15c3996e62eb24afbf691945))


### Chores

* **deps:** bump actions/checkout from 4.2.0 to 4.2.1 in /.github/workflows in the gha group ([#1273](https://github.com/nwutils/nw-builder/issues/1273)) ([3165f2b](https://github.com/nwutils/nw-builder/commit/3165f2b0a6da286295ddc94b4178b7567d394043))
* **deps:** bump the npm group across 1 directory with 7 updates ([#1275](https://github.com/nwutils/nw-builder/issues/1275)) ([5f26f21](https://github.com/nwutils/nw-builder/commit/5f26f21df78997aa5add40f5c049ec7fd2917474))
* **deps:** drop Dependabot support for v3 branch ([19cf479](https://github.com/nwutils/nw-builder/commit/19cf47973057c420dc0bb70ddb5e50df1aa0de4c))

## [4.11.3](https://github.com/nwutils/nw-builder/compare/v4.11.2...v4.11.3) (2024-10-02)


### Bug Fixes

* **get:** do not check integrity of community ffmpeg but give a warning ([#1253](https://github.com/nwutils/nw-builder/issues/1253)) ([0c05a34](https://github.com/nwutils/nw-builder/commit/0c05a3493c25a172c018e0d788a563c80592c2ef)), closes [#1209](https://github.com/nwutils/nw-builder/issues/1209)

## [4.11.2](https://github.com/nwutils/nw-builder/compare/v4.11.1...v4.11.2) (2024-10-02)


### Bug Fixes

* **get:** verify shasum for official ffmpeg not community ffmpeg ([#1251](https://github.com/nwutils/nw-builder/issues/1251)) ([9385836](https://github.com/nwutils/nw-builder/commit/938583602788f55f1e050013e78890118e19ed7a)), closes [#1209](https://github.com/nwutils/nw-builder/issues/1209)

## [4.11.1](https://github.com/nwutils/nw-builder/compare/v4.11.0...v4.11.1) (2024-10-01)


### Bug Fixes

* **types:** add managedManifest parameter in options ([#1249](https://github.com/nwutils/nw-builder/issues/1249)) ([8b3b407](https://github.com/nwutils/nw-builder/commit/8b3b407ab96e8f4162abf92b6e8158923f71687f)), closes [#1248](https://github.com/nwutils/nw-builder/issues/1248)


### Chores

* **deps-dev:** bump the npm group across 1 directory with 6 updates ([#1250](https://github.com/nwutils/nw-builder/issues/1250)) ([94da963](https://github.com/nwutils/nw-builder/commit/94da963848ef2f311d13da49a1d78e6b8f117b22))
* **deps:** bump rollup from 4.22.1 to 4.22.4 ([#1241](https://github.com/nwutils/nw-builder/issues/1241)) ([6601ebc](https://github.com/nwutils/nw-builder/commit/6601ebc3db46e28964e0aa05de37a2f68745ba46))
* **deps:** bump the gha group across 1 directory with 2 updates ([#1247](https://github.com/nwutils/nw-builder/issues/1247)) ([526454e](https://github.com/nwutils/nw-builder/commit/526454e276c67bac435c02699109ae563fe1c4d7))

## [4.11.0](https://github.com/nwutils/nw-builder/compare/v4.10.0...v4.11.0) (2024-09-20)


### Features

* **bld:** add NSLocalNetworkUsageDescription option for MacOS ([#1236](https://github.com/nwutils/nw-builder/issues/1236)) ([eea3f69](https://github.com/nwutils/nw-builder/commit/eea3f69ee1951e24f4fbc8d1550b0bee1e43951f)), closes [#1235](https://github.com/nwutils/nw-builder/issues/1235)


### Chores

* **bld:** remove repetitive code for updating MacOS Helper apps ([#1214](https://github.com/nwutils/nw-builder/issues/1214)) ([e1edc05](https://github.com/nwutils/nw-builder/commit/e1edc051c1660ef474643b903ac4e9a0f2968a05))
* **cli:** migrate from yargs to commander ([#1216](https://github.com/nwutils/nw-builder/issues/1216)) ([7ca5a28](https://github.com/nwutils/nw-builder/commit/7ca5a28f40078ab179aab72cf0f3260ef5f118f2))
* **deps:** bump actions/setup-node from 4.0.3 to 4.0.4 in /.github/workflows in the gha group ([#1232](https://github.com/nwutils/nw-builder/issues/1232)) ([8473fc6](https://github.com/nwutils/nw-builder/commit/8473fc63811fd08066b7801c019d00565918770b))
* **deps:** bump the npm group across 1 directory with 7 updates ([#1233](https://github.com/nwutils/nw-builder/issues/1233)) ([9efa2f4](https://github.com/nwutils/nw-builder/commit/9efa2f439e46aaadf55c79d9c3bd404cea1144aa))
* **deps:** bump vite from 5.3.5 to 5.4.6 ([#1231](https://github.com/nwutils/nw-builder/issues/1231)) ([6135682](https://github.com/nwutils/nw-builder/commit/6135682dc01f8a1dad12660957ddd637e6a20864))

## [4.10.0](https://github.com/nwutils/nw-builder/compare/v4.9.0...v4.10.0) (2024-08-24)


### Features

* **bld:** rename MacOS Helper apps ([#1206](https://github.com/nwutils/nw-builder/issues/1206)) ([9f3b30f](https://github.com/nwutils/nw-builder/commit/9f3b30f9e04c2d2d103f5ec19078c0a14fbf12f7))


### Chores

* **deps:** bump davelosert/vitest-coverage-report-action from 2.5.0 to 2.5.1 in /.github/workflows in the gha group ([#1210](https://github.com/nwutils/nw-builder/issues/1210)) ([6d69ae3](https://github.com/nwutils/nw-builder/commit/6d69ae36bc1edcf1867aa25e464e4a9b1aa28aa4))
* **deps:** bump the npm group across 1 directory with 3 updates ([#1212](https://github.com/nwutils/nw-builder/issues/1212)) ([20b7e81](https://github.com/nwutils/nw-builder/commit/20b7e8190f022bc8a50776176bdcc70d3bdcd08f))
* **get:** improve error message when comparing shasums ([#1213](https://github.com/nwutils/nw-builder/issues/1213)) ([b37068f](https://github.com/nwutils/nw-builder/commit/b37068f9228c1f00877d51c5fe607be7096b6564)), closes [#1209](https://github.com/nwutils/nw-builder/issues/1209)
* **test:** move tests to seperate dir ([#1205](https://github.com/nwutils/nw-builder/issues/1205)) ([da0e353](https://github.com/nwutils/nw-builder/commit/da0e353e805b8e4b249f298c74a352a114b2737d))
* **test:** rename fixtures dir ([c6193bb](https://github.com/nwutils/nw-builder/commit/c6193bb67fa32d750b42f9a8a7d44db507126519))

## [4.9.0](https://github.com/nwutils/nw-builder/compare/v4.8.1...v4.9.0) (2024-08-15)


### Features

* **get:** verify sha256 checksum ([#1201](https://github.com/nwutils/nw-builder/issues/1201)) ([810944d](https://github.com/nwutils/nw-builder/commit/810944da14ffc97d8fb2b5d78d7c8d09ad514226))


### Chores

* **deps:** bump the npm group across 1 directory with 4 updates ([#1199](https://github.com/nwutils/nw-builder/issues/1199)) ([b07d1fc](https://github.com/nwutils/nw-builder/commit/b07d1fc09d4fcc8282b04c369725594d120af12a))
* **deps:** bump volta-cli/action from 4.1.1 to 4.2.1 in /.github/workflows in the gha group across 1 directory ([#1189](https://github.com/nwutils/nw-builder/issues/1189)) ([282ea7a](https://github.com/nwutils/nw-builder/commit/282ea7ade9d93dbbf8d97c9c0770df0876c3fd8a))
* **deps:** remove license check logic ([9dde7b2](https://github.com/nwutils/nw-builder/commit/9dde7b2b36a1ccd0effb546a89584d2075e59a17))

## [4.8.1](https://github.com/nwutils/nw-builder/compare/v4.8.0...v4.8.1) (2024-08-05)


### Bug Fixes

* **bld:** maintain cwd when using managedManifest or nativeAddon ([#1187](https://github.com/nwutils/nw-builder/issues/1187)) ([40223db](https://github.com/nwutils/nw-builder/commit/40223db6af75651618df7f3099b99191faa11f24)), closes [#1186](https://github.com/nwutils/nw-builder/issues/1186)


### Chores

* **deps:** bump the npm group across 1 directory with 6 updates ([#1185](https://github.com/nwutils/nw-builder/issues/1185)) ([f4c0822](https://github.com/nwutils/nw-builder/commit/f4c08224c7651b3eecf2353a7a50fd7cf240c2f0))
* **deps:** remove unused cli-progress package ([8f4e07d](https://github.com/nwutils/nw-builder/commit/8f4e07dfbda348fcc832694d346be7616bfb1f4b))

## [4.8.0](https://github.com/nwutils/nw-builder/compare/v4.7.8...v4.8.0) (2024-07-27)


### Features

* **bld:** add languageCode option for Windows ([#1175](https://github.com/nwutils/nw-builder/issues/1175)) ([96ad585](https://github.com/nwutils/nw-builder/commit/96ad585ec170416d31248ccf3503191831e802b0))


### Bug Fixes

* **bld:** pass nw manifest correctly when managedManifest is true ([#1176](https://github.com/nwutils/nw-builder/issues/1176)) ([949c4b7](https://github.com/nwutils/nw-builder/commit/949c4b70b89cc96ee98d88b910caa833eb99d385))


### Chores

* **ci:** check for valid licenses ([#1150](https://github.com/nwutils/nw-builder/issues/1150)) ([ab99731](https://github.com/nwutils/nw-builder/commit/ab997311046b1e75aee24397a3b9bb20d19c4d2f))
* **deps:** bump actions/setup-node from 4.0.2 to 4.0.3 in /.github/workflows in the gha group ([#1151](https://github.com/nwutils/nw-builder/issues/1151)) ([7130930](https://github.com/nwutils/nw-builder/commit/7130930c3d7ce28c1e07c510045576830e266c77))
* **deps:** bump the npm group across 1 directory with 8 updates ([#1177](https://github.com/nwutils/nw-builder/issues/1177)) ([9410455](https://github.com/nwutils/nw-builder/commit/94104551d8b8f8c1ece595e34caa91b3c34dc0a3))
* **deps:** migrate from compressing to tar and archiver ([7c73903](https://github.com/nwutils/nw-builder/commit/7c73903d6c3723814df64d9241976b457cb2d149))
* **docs:** improve install/quick start ([a87f44b](https://github.com/nwutils/nw-builder/commit/a87f44b5f6e0bdc0e09569a560b10a032766da02))
* fsm -&gt; fs.promises ([08d79bf](https://github.com/nwutils/nw-builder/commit/08d79bf07c0b590a376af4cc53a37db4d75094cf))

## [4.7.8](https://github.com/nwutils/nw-builder/compare/v4.7.7...v4.7.8) (2024-07-02)


### Chores

* **ci:** add Vitest Coverage Action ([#1136](https://github.com/nwutils/nw-builder/issues/1136)) ([4d32845](https://github.com/nwutils/nw-builder/commit/4d32845877ee7a64b61e8226b5593f6c8137524a)), closes [#1041](https://github.com/nwutils/nw-builder/issues/1041)
* **deps-dev:** bump eslint-plugin-jsdoc from 48.2.13 to 48.4.0 in the npm group ([#1138](https://github.com/nwutils/nw-builder/issues/1138)) ([61189de](https://github.com/nwutils/nw-builder/commit/61189de946bf5bafd2acdd7b37b05e5a68e6b9a3))
* **deps-dev:** bump the npm group across 1 directory with 4 updates ([#1142](https://github.com/nwutils/nw-builder/issues/1142)) ([761963d](https://github.com/nwutils/nw-builder/commit/761963d60db32aa53fd585204ea83868164986ae))
* **deps:** bump davelosert/vitest-coverage-report-action from 2.4.0 to 2.5.0 in /.github/workflows in the gha group ([#1140](https://github.com/nwutils/nw-builder/issues/1140)) ([fddaf9f](https://github.com/nwutils/nw-builder/commit/fddaf9f1a2f53b8c9b8314b4043d5a0523be2e35))
* **test:** enable vitest json reporter ([e44aadb](https://github.com/nwutils/nw-builder/commit/e44aadb880b794b99516069d2c40473a72f18dc5))

## [4.7.7](https://github.com/nwutils/nw-builder/compare/v4.7.6...v4.7.7) (2024-06-22)


### Bug Fixes

* execute postinstall script iff in development mode ([#1132](https://github.com/nwutils/nw-builder/issues/1132)) ([3c68216](https://github.com/nwutils/nw-builder/commit/3c682167369248e96ed48ea06163169805fcedda))


### Chores

* **deps:** bump the npm group across 1 directory with 6 updates ([#1135](https://github.com/nwutils/nw-builder/issues/1135)) ([905478a](https://github.com/nwutils/nw-builder/commit/905478a0156a9047aa10f629cb53200ee6f90e65))

## [4.7.6](https://github.com/nwutils/nw-builder/compare/v4.7.5...v4.7.6) (2024-06-19)


### Bug Fixes

* **bld:** resolve undefined reference ([#1127](https://github.com/nwutils/nw-builder/issues/1127)) ([006b517](https://github.com/nwutils/nw-builder/commit/006b517be0420e08134b5670e5d62a91f8b9107c)), closes [#1125](https://github.com/nwutils/nw-builder/issues/1125)


### Chores

* **deps-dev:** bump @stylistic/eslint-plugin-js from 2.1.0 to 2.2.1 in the npm group ([#1123](https://github.com/nwutils/nw-builder/issues/1123)) ([fcd83a9](https://github.com/nwutils/nw-builder/commit/fcd83a9875068ed9e86870cb4bbdabcb86b74bef))
* **deps-dev:** bump ws from 8.17.0 to 8.17.1 ([#1126](https://github.com/nwutils/nw-builder/issues/1126)) ([7aa6f08](https://github.com/nwutils/nw-builder/commit/7aa6f08927869c8ceb5da686bb53e48f537f7a40))
* **deps:** bump actions/checkout from 4.1.6 to 4.1.7 in /.github/workflows in the gha group ([#1116](https://github.com/nwutils/nw-builder/issues/1116)) ([eefde68](https://github.com/nwutils/nw-builder/commit/eefde686e344ae3e51191caf66a5b6b0b1b736fe))
* **test:** enable e2e tests ([#1120](https://github.com/nwutils/nw-builder/issues/1120)) ([f802947](https://github.com/nwutils/nw-builder/commit/f80294712240caf8ccf225684eaec20ecb5f80a8))

## [4.7.5](https://github.com/nwutils/nw-builder/compare/v4.7.4...v4.7.5) (2024-06-11)


### Bug Fixes

* **run:** set stdio behaviour to inherit ([a3d181a](https://github.com/nwutils/nw-builder/commit/a3d181a5b9b6f967c11e7082fea57db96078bf7e))


### Chores

* **bld:** migrate from rcedit with resedit ([#1094](https://github.com/nwutils/nw-builder/issues/1094)) ([03a55b9](https://github.com/nwutils/nw-builder/commit/03a55b919a7e5dfcc1d9fa3f06baa327804d67c4))
* **deps:** bump actions/checkout from 4.1.5 to 4.1.6 in /.github/workflows in the gha group ([#1095](https://github.com/nwutils/nw-builder/issues/1095)) ([0f1b126](https://github.com/nwutils/nw-builder/commit/0f1b1260d3a36939c111313ec1ab121fe8f12955))
* **deps:** bump google-github-actions/release-please-action from 4.1.0 to 4.1.1 in /.github/workflows in the gha group ([#1091](https://github.com/nwutils/nw-builder/issues/1091)) ([316741b](https://github.com/nwutils/nw-builder/commit/316741ba699fcd0f8a7dd1176cbd14ca05c571be))
* **deps:** bump googleapis/release-please-action from 4.1.1 to 4.1.3 in /.github/workflows in the gha group ([#1114](https://github.com/nwutils/nw-builder/issues/1114)) ([e284f5b](https://github.com/nwutils/nw-builder/commit/e284f5b61c0df05b63388ea5d31311f5daacd858))
* **deps:** bump the npm group across 1 directory with 3 updates ([#1112](https://github.com/nwutils/nw-builder/issues/1112)) ([fde3491](https://github.com/nwutils/nw-builder/commit/fde34914d920245f535184ae545a56d939c59b8d))
* **deps:** bump the npm group across 1 directory with 6 updates ([#1105](https://github.com/nwutils/nw-builder/issues/1105)) ([eb63ded](https://github.com/nwutils/nw-builder/commit/eb63dedabbf2ae525fa9f1ab6aa57d9b11c63fe0))
* **deps:** upgrade to eslint v9 ([ffe6dd0](https://github.com/nwutils/nw-builder/commit/ffe6dd0238a8401fab46beed06c2812b0fa89abd))
* **docs:** add missing platform-specific app options info ([#1093](https://github.com/nwutils/nw-builder/issues/1093)) ([715097f](https://github.com/nwutils/nw-builder/commit/715097f53dfe69e7895634fd85e4043b6a3242e1))

## [4.7.4](https://github.com/nwutils/nw-builder/compare/v4.7.3...v4.7.4) (2024-05-12)


### Bug Fixes

* **cli:** add missing options managedManifest and nodeAddon ([#1084](https://github.com/nwutils/nw-builder/issues/1084)) ([f6ced81](https://github.com/nwutils/nw-builder/commit/f6ced81d1e9b2b862fd916fcb7432a0d53881039))


### Chores

* **deps:** bump the npm group with 4 updates ([#1082](https://github.com/nwutils/nw-builder/issues/1082)) ([26cbf88](https://github.com/nwutils/nw-builder/commit/26cbf881cc7460f088ad9b5fdd84d10b5c7589ab))

## [4.7.3](https://github.com/nwutils/nw-builder/compare/v4.7.2...v4.7.3) (2024-05-09)


### Bug Fixes

* **cli:** disallow unknown options ([#1079](https://github.com/nwutils/nw-builder/issues/1079)) ([5d54d8c](https://github.com/nwutils/nw-builder/commit/5d54d8c20927c5dfabacc128d1cee036a7cf6fb5))

## [4.7.2](https://github.com/nwutils/nw-builder/compare/v4.7.1...v4.7.2) (2024-05-09)


### Bug Fixes

* **get:** close file after reading all entries ([#1077](https://github.com/nwutils/nw-builder/issues/1077)) ([a6b090f](https://github.com/nwutils/nw-builder/commit/a6b090fd3ebeb4ed4d45d04c711d00eddf79dc9e))


### Chores

* **ci:** correct config hopefully ([0bad4d2](https://github.com/nwutils/nw-builder/commit/0bad4d2893389a76f7292bfaffaa77cdb8094571))
* **deps:** bump the gha group in /.github/workflows with 2 updates ([#1074](https://github.com/nwutils/nw-builder/issues/1074)) ([fd8a633](https://github.com/nwutils/nw-builder/commit/fd8a6335a26a01f187171e607f289485b0d4865f))
* **deps:** bump the npm group across 1 directory with 11 updates ([#1078](https://github.com/nwutils/nw-builder/issues/1078)) ([7158c7b](https://github.com/nwutils/nw-builder/commit/7158c7b8881d333995d1cda32812776500d7d96b))
* **deps:** bump vite from 5.1.6 to 5.2.8 ([#1060](https://github.com/nwutils/nw-builder/issues/1060)) ([c52dbb6](https://github.com/nwutils/nw-builder/commit/c52dbb690f46d8929dbd9ba553eb9967b7683988))
* **docs:** update contributing guidelines ([efdbdca](https://github.com/nwutils/nw-builder/commit/efdbdca0f73a91129dc279d2f7346084f8a0cefe))

## [4.7.1](https://github.com/nwutils/nw-builder/compare/v4.7.0...v4.7.1) (2024-03-30)


### Bug Fixes

* **get:** missing import ([bd2273a](https://github.com/nwutils/nw-builder/commit/bd2273a84199de3b804e96c92da88e66aa7fce32))


### Chores

* **deps:** reconfigure dependabot ([698ecd5](https://github.com/nwutils/nw-builder/commit/698ecd5817a9f4ee7e17271410ebce78157644fa))

## [4.7.0](https://github.com/nwutils/nw-builder/compare/v4.6.4...v4.7.0) (2024-03-26)


### Features

* **get:** support `file://` for `options.downloadUrl` ([094567c](https://github.com/nwutils/nw-builder/commit/094567c1192c66465fb8ed43d6e5b6f0ed7cfdec))


### Chores

* **deps:** bump follow-redirects from 1.15.5 to 1.15.6 ([#1052](https://github.com/nwutils/nw-builder/issues/1052)) ([8258de9](https://github.com/nwutils/nw-builder/commit/8258de9773fe5b9e497abbb9cea6978329ee6707))
* **deps:** bump the gha group in /.github/workflows with 1 update ([#1054](https://github.com/nwutils/nw-builder/issues/1054)) ([1935800](https://github.com/nwutils/nw-builder/commit/1935800ce560ad5c59cf422276916e3960a60a0d))
* **deps:** bump the gha group in /.github/workflows with 2 updates ([#1051](https://github.com/nwutils/nw-builder/issues/1051)) ([0362403](https://github.com/nwutils/nw-builder/commit/0362403b9501465258b974caefe623eebfb640f1))
* **deps:** bump the npm group with 1 update ([#1055](https://github.com/nwutils/nw-builder/issues/1055)) ([5a7bc71](https://github.com/nwutils/nw-builder/commit/5a7bc718a82b0907b89035412fda25cef54f32f6))
* **deps:** bump the npm group with 3 updates ([#1050](https://github.com/nwutils/nw-builder/issues/1050)) ([a70aabc](https://github.com/nwutils/nw-builder/commit/a70aabc14b5614a32d4fbfa995e35af123cef65f))
* **deps:** bump the npm group with 8 updates ([#1048](https://github.com/nwutils/nw-builder/issues/1048)) ([0ca3c34](https://github.com/nwutils/nw-builder/commit/0ca3c341f312b584b37628a9d3726eca2b4584be))
* **get:** deprecate get mode ([#1053](https://github.com/nwutils/nw-builder/issues/1053)) ([386fc18](https://github.com/nwutils/nw-builder/commit/386fc18efc4779438591cbc3ab39c72f65473215))

## [4.6.4](https://github.com/nwutils/nw-builder/compare/v4.6.3...v4.6.4) (2024-02-24)


### Bug Fixes

* **get:** copy ffmpeg to correct location on windows ([#1044](https://github.com/nwutils/nw-builder/issues/1044)) ([71fa4ab](https://github.com/nwutils/nw-builder/commit/71fa4ab471c77b2853dd822e4ea5e97cbd9daeb9))

## [4.6.3](https://github.com/nwutils/nw-builder/compare/v4.6.2...v4.6.3) (2024-02-22)


### Bug Fixes

* **get:** correct ffmpeg path ([#1042](https://github.com/nwutils/nw-builder/issues/1042)) ([391a6e1](https://github.com/nwutils/nw-builder/commit/391a6e1a715407ba45ea4b12dda812caea709535))


### Chores

* **docs:** update contributing guidelines ([ca594df](https://github.com/nwutils/nw-builder/commit/ca594df7beaa49a95d2fa33c14ebcc120a0b6d3c))

## [4.6.2](https://github.com/nwutils/nw-builder/compare/v4.6.1...v4.6.2) (2024-02-22)


### Bug Fixes

* **get:** ffmpeg and symlinks ([d5c1bf5](https://github.com/nwutils/nw-builder/commit/d5c1bf53cc66afdf79c3f9653ff6b9e77a7de4b6))


### Chores

* **deps:** bump ip from 2.0.0 to 2.0.1 ([2284d52](https://github.com/nwutils/nw-builder/commit/2284d52ba0c4d1bb9a86a91e138ba99ce2af8d6c))

## [4.6.1](https://github.com/nwutils/nw-builder/compare/v4.6.0...v4.6.1) (2024-02-15)


### Chores

* **ci:** add chores section to changelog ([#1028](https://github.com/nwutils/nw-builder/issues/1028)) ([d630720](https://github.com/nwutils/nw-builder/commit/d630720039ba81563aa0e00995aa004c8d5edc79))
* **ci:** fixup release please action ([#1032](https://github.com/nwutils/nw-builder/issues/1032)) ([f9ae7cd](https://github.com/nwutils/nw-builder/commit/f9ae7cd170bba17849ff66ac4612df9d3a0716de))
* **ci:** remove `schema` prop ([33238b1](https://github.com/nwutils/nw-builder/commit/33238b14fb1bff16bd351826bd2d891c7e6d136c))
* **deps:** bump the gha group in /.github/workflows with 1 update ([70030df](https://github.com/nwutils/nw-builder/commit/70030df94d55e5563775df16b7f07b2537198f69))
* **docs:** update PR template to simplify commit descriptions ([#1029](https://github.com/nwutils/nw-builder/issues/1029)) ([6da9b89](https://github.com/nwutils/nw-builder/commit/6da9b898f74309dde6ca120dddbeaa32e7bdbcfc))
* **docs:** update readme and changelog ([63fd50b](https://github.com/nwutils/nw-builder/commit/63fd50bdbfed52de4be4332601944e058b11d793))
* fix remaining lint errors ([334ae74](https://github.com/nwutils/nw-builder/commit/334ae744d2d1d56d973145e407a987107675eb04))
* **get:** refactor implementation ([#1025](https://github.com/nwutils/nw-builder/issues/1025)) ([72f65e1](https://github.com/nwutils/nw-builder/commit/72f65e134b3f5dfd543aba9d292c016da8b6d7f3))
* **get:** refactor unzip symlink implementation ([#1030](https://github.com/nwutils/nw-builder/issues/1030)) ([69661c3](https://github.com/nwutils/nw-builder/commit/69661c301278f2f4071f41fa71e909733698c680))
* **get:** simplify symlink logic ([#1035](https://github.com/nwutils/nw-builder/issues/1035)) ([4f64307](https://github.com/nwutils/nw-builder/commit/4f643077fb259fb1374e41c88abc801486f8467c)), closes [#1030](https://github.com/nwutils/nw-builder/issues/1030)
* **release-please-action:** do not point to manifest file ([96eeec8](https://github.com/nwutils/nw-builder/commit/96eeec806e1aba0b62acd899d5b9e98070a32b64))
* **release-please-action:** point to config and manifest ([0a6a44d](https://github.com/nwutils/nw-builder/commit/0a6a44db44ae19c246221f7f05450f6ef1e9f646))
* **release-please:** correct path to package ([3719cee](https://github.com/nwutils/nw-builder/commit/3719cee4571b46b6b4c2c4d2b6806864e3c90c16))
* **release-please:** remove manifest ([23a16fb](https://github.com/nwutils/nw-builder/commit/23a16fbd5e93c3ad1221dad6106299079f81ea7c))
* **run:** mark run mode as deprecated ([#1027](https://github.com/nwutils/nw-builder/issues/1027)) ([1115728](https://github.com/nwutils/nw-builder/commit/1115728d433cba123a7e2dd54a52abaaed4710a6))
* **test:** try adding chores to release notes ([#1031](https://github.com/nwutils/nw-builder/issues/1031)) ([5cabc20](https://github.com/nwutils/nw-builder/commit/5cabc20e79bb0fe0d77687f97ac4fae8fc3e95a9))

## [4.6.0](https://github.com/nwutils/nw-builder/compare/v4.5.4...v4.6.0) (2024-02-01)


### Features

* **get:** set `cacheDir` on another volume ([#1023](https://github.com/nwutils/nw-builder/issues/1023)) ([7c0f711](https://github.com/nwutils/nw-builder/commit/7c0f711d407c4f992e7897e9d590f03d3105db4e)), closes [#1017](https://github.com/nwutils/nw-builder/issues/1017)

## [Unreleased]

## [4.5.4] - 2024-01-23

### Changed

- Migrate from `unzipper` to `yauzl-promise` to prevent corrupting files. 

## [4.5.3] - 2023-12-20

### Changed

- Wrap `unzipper` call inside Promise to prevent race condition.

## [4.5.2] - 2023-12-19

### Changed

- Fix `yargs/helpers` import for cli usage.

## [4.5.1] - 2023-12-19

### Changed

- Manually create symbolic links for MacOS builds.

## [4.5.0] - 2023-12-18

## Added

- Use `unzipper` to decompress ZIP files.

## Changed

- Use `tar` to extract tarballs.
- Disable `options.nativeAddon`.

### Removed

- Remove `yauzl-promise` since it does not preserve symlinks on MacOS.

## [4.4.2-beta.4] - 2023-11-03

### Changed

- Use `yauzl-promise` to decompress MacOS build on MacOS platform.

### Removed

- Native package `unzip` usage.

## [4.4.2-beta.3] - 2023-10-23

### Added

- Align cache implementation with `nwjs/npm-installer`
- `nw` module can [use the `options.cacheDir`](https://github.com/nwjs/npm-installer#retrieve-binaries-from-custom-download-location-or-file-path) to get cached NW.js binaries.

## [4.4.2-beta.2] - 2023-10-20

### Added

- Node Native Addon support using GYP. To enable, set `options.nativeAddon` to `gyp`.

## [4.4.2-beta.1] - 2023-10-16

### Added

- Managed Manifest mode. `options.ManagedManifest` defaults to `false`.
- If `true`, then first `package.json` globbed is parsed as manifest.
- If JSON type, object is parsed as manifest.
- If string type, then resolve as file path to manifest.

## [4.4.2] - 2023-10-16

### Changed

- Fix FFmpeg decompression.
- Auto generate docs from JSDoc comments.
- Improve TypeScript type definitions.
- Fix get mode.
- Refactor build mode.
- Generate markdown docs from JSDocs.

## [4.4.1] - 2023-09-06

### Changed

- Improve debug logging.
- Fixed handling of argv.

## [4.4.0] - 2023-09-05

### Added

- Cache community FFmpeg.
- Move FFmpeg decompress function to relevant location

## [4.3.11] - 2023-09-05

### Changed

- Separate download logic for NW.js and FFmpeg.

## [4.3.10] - 2023-08-21

### Removed

- Do not copy the first `package.json` encountered to the root of `options.outDir` when `options.glob` is enabled. This may seem like a breaking change but it is actually reverting incorrect behaviour.

## [4.3.9] - 2023-08-15

### Changed

- Some mac environments don't restore symlinks when using compressing lib. Now we will use system `unzip` command to extract zip files

## [4.3.8] - 2023-08-14

### Changed

- Handle error during ffmpeg copy on some mac environments

## [4.3.7] - 2023-08-11

### Changed

- Move community `ffmpeg` in the correct folder.

## [4.3.6] - 2023-08-11

### Changed

- Move community `ffmpeg` in the correct folder.

## [4.3.5] - 2023-08-03

### Changed

- Return promise in get mode to await it correctly.

## [4.3.4] - 2023-08-02

### Changed

- Conditonally set Icon for Windows build.
- Refactor `get` mode into a single file.

## [4.3.3] - 2023-07-25

### Changed

- Set `NSHumanReadableCopyright` property in `*.app/Resources/en.lproj/InfoPlist.strings` to update copyright

### Removed

- `NSHumanReadableCopyright` from `Info.plist`

## [4.3.2] - 2023-07-11

### Added

- Descriptions and argument types for remaining cli arguments.

## [4.3.1] - 2023-07-07

### Changed

- Replace the icon at `nwjs.app/Contents/Resources/app.icns` with the icon at `options.app.icon` file path.

### Removed

- `xattr` package. The `com.apple.quarantine` flag should be handled by the developer.

## [4.3.0] - 2023-07-03

### Added

- Compress `outDir` to `zip`, `tar` and `tgz` formats.
- Specify log level via `options.logLevel`.
- Add platform, arch, Node and NW.js info in debug log.
- Add MacOS name, version, description and legal metadata
- Removed redundant `options.app.icon` property (Refer to NW.js docs on how to set icon)

## [4.2.8] - 2023-06-29

### Changed

- Refactor `zip` implementation. Use `compressing` instead of `archiver` package.
- If `zip` is `true` or `"zip"`, then remove outDir after compression. (This was supposed to be the intented behavior all along).

## [4.2.7] - 2023-06-27

### Changed

- Redownload `manifest.json` every time the `nwbuild` function is executed.
- If `manifest.json` already exists and we are unable to connect to the `nwjs.io` domain, then use the existing manifest.
- If no `manifest.json` exists in the cache dir, then the `validate` function will cache this and throw an error - preventing the build.

## [4.2.6] - 2023-06-20

### Changed

- Preserve relative symbolic links of NW.js files during build mode

## [4.2.5] - 2023-06-20

### Changed

- Rename executable using `options.app.name` value.

## [4.2.4] - 2023-06-18

### Changed

- Migrate from `decompress` to `compressing`

## [4.2.3-beta.2] - 2023-06-16

### Changed

- Preserve relative symbolic links during build mode

## [4.2.3-beta.1] - 2023-06-15

### Changed

- Do not resolve `options.srcDir` when parsing `options` object.

## [4.2.3] - 2023-04-19

### Changed

- Fix module imports which broke in [04ccd51](https://github.com/nwutils/nw-builder/commit/04ccd514f264f5590e5f86c42288904fe027901f)

## [4.2.2] - 2023-04-14

### Added

- Validation for `options.version`.
- Type definition file for `nwbuild` function.

## [4.2.1] - 2023-03-28

### Changed

- Set `files` to `options.srcDir` if glob disabled preventing a `package.json` not found error.

## [4.2.0] - 2023-03-27

## Added

- Glob flag defaulting to true. Currently file globbing is broken and it is recommended to set `glob` to false.

### Changed

- Fixed `get` mode
- Fixed `run` mode
- Fixed `build` mode
- Updated `get` mode docs

## [4.1.1-beta.2] - 2023-03-15

### Changed

- Parse the first `package.json` file and treat it as the NW.js manifest. Copy it to `outDir/package.nw/package.json` for Linux and Windows and `outDir/nwjs.app/Contents/Resources/app.nw/package.json` for MacOS.

To simplify your workflow, you can pass the path to the `package.json` first:

```shell
nwbuild ./path/to/package.json ./app/**/* ./node_modules/**/*
```

Make sure your manifest file's `main` property points to a valid file path. In this case it might be:

```json
{
  "main": "app/index.html"
}
```

## [4.1.1-beta.1] - 2023-03-14

### Added

- `get` mode to only download NW.js binaries. Example use case: download during Node's `postinstall` hook:

```json
{
  "scripts": {
    "postinstall": "nwbuild --mode=get --flavor=sdk"
  }
}
```

- Check if NW.js's Node version matches host's Node version

## Changed

- Fix undefined import for Windows configuration

## [4.1.1-beta.0] - 2023-03-12

### Changed

- Remove false test for run mode.

## [4.1.1] - 2023-03-12

### Changed

- Glob file and directory differently.
- MacOS ARM build is no longer behind `beta` version.

## [4.1.0-beta.3] - 2023-03-01

### Added

- Allow list `https://npmmirror.com/mirrors/nwjs/` and `https://npm.taobao.org/mirrors/nwjs/` mirrors.

## [4.1.0-beta.2] - 2023-02-29

### Changed

- Do not convert srcDir files to absolute paths.
- Copy files to correct location.

## [4.1.0-beta.1] - 2023-02-28

### Changed

- Resolve path iff file path type is valid.

## [4.1.0-beta.0] - 2023-02-25

### Added

- MacOS ARM support

## [4.1.0] - 2023-02-23

## Added

- Use (community) prebuilt version of `ffmpeg` if the `ffmpeg` flag is `true` (defaults to `false`).

### Changed

- `await` platform specific config steps

## [4.0.11] - 2023-02-5

### Changed

- Security update `http-cache-semantics` to `v4.1.1`.

## [4.0.10] - 2023-02-05

### Added

- `options.cli` flag to prevent `node-glob` from globbing already globbed files and erroring out with a `package.json not found in srcDir file glob patterns` message.

### Changed

- Copy subdirectories of `options.srDir` in the correct location.

## [4.0.9] - 2023-02-03

### Added

- Run and build demo app in CI.

### Changed

- Fixed false positives in CI
- Throw errors instead of returning them
- Reject error object instead of exit code

## [4.0.8] - 2023-01-15

### Added

- Flag to check if specific `nw` release is cached. [#772](https://github.com/nwutils/nw-builder/pull/772)

### Changed

- Create `cacheDir`, `outDir` before getting release info. [#772](https://github.com/nwutils/nw-builder/pull/772)

## [4.0.7] - 2023-01-14

### Changed

- Do not throw error if `nwbuild` is of `object` type. [#769](https://github.com/nwutils/nw-builder/pull/769)

- Fix `package.json` path for `updateNotifier`. [#767](https://github.com/nwutils/nw-builder/pull/767)

## [4.0.6] - 2023-01-09

### Added

- Warn about loss of permissions if building Linux or MacOS on Windows. [8793d4b](https://github.com/nwutils/nw-builder/commit/8793d4bf06288199fcaff340fda43c1e2fbcacbc)

### Changed

- Fix error when `options.version` is `latest`. [33ef184](https://github.com/nwutils/nw-builder/commit/33ef184467f78fed94541e876da042b4ed99d443)

### Removed

- CJS support [968f798](https://github.com/nwutils/nw-builder/commit/968f7980de59fea72ddac8e1d64628e561de1f9a)

## [4.0.5] - 2023-01-06

### Changed

- Prevent duplicate globbing of `srcDir` files. [07901c9](https://github.com/nwutils/nw-builder/commit/07901c9e3930481ead0977b9be731765df28c087)

## [4.0.4] - 2023-01-06

### Changed

- Convert `srcDir` type from `string[]` to `string`. [1a699af](https://github.com/nwutils/nw-builder/commit/1a699af300782e0847333bb7ad945dbde8940350)

## [4.0.3] - 2023-01-06

### Added

- File globing. [#749](https://github.com/nwutils/nw-builder/pull/749)

- Linux and Windows configuration options. [#729](https://github.com/nwutils/nw-builder/pull/729)

### Changed

- Skip modification of Windows executable if platform is not Windows or Wine is not installed. [#739](https://github.com/nwutils/nw-builder/pull/739)

- Run mode should only require `srcDir`, `version` and `flavor`. [#718](https://github.com/nwutils/nw-builder/pull/718)

## [4.0.2] - 2022-11-30

### Added

- Allow user to rename NW executable. [#712](https://github.com/nwutils/nw-builder/pull/712)

### Changed

- Fix MacOS build. [#717](https://github.com/nwutils/nw-builder/pull/717)

- CJS support via `esbuild`. [#713](https://github.com/nwutils/nw-builder/pull/713)

## [4.0.1] - 2022-11-20

### Added

- Support for Desktop Entry file. [#690](https://github.com/nwutils/nw-builder/pull/690)

### Changed

- Resolve promise in `close` event with respect to compression. [#698](https://github.com/nwutils/nw-builder/pull/698)

- Check for release info after downloading NW binaries in `cacheDir`. [#697](https://github.com/nwutils/nw-builder/pull/697)

## [4.0.0] - 2022-11-16

### Added

- Rename Helper apps. [#687](https://github.com/nwutils/nw-builder/pull/687)

- MacOS support. [#685](https://github.com/nwutils/nw-builder/pull/685)

- Check for `nwbuild` object in `package.json`. [#684](https://github.com/nwutils/nw-builder/pull/684)

## [3.8.6] - 2022-09-22

- Fix mac and windows build

## [3.8.5] - 2022-09-20

### Added

- `nwbuild` function which accidently got removed.

### Changed

- Update usage docs for `nwbuild`

## [3.8.4] - 2022-09-20

### Changed

- Refactor download function

## [3.8.3-beta.1]

### Changed

- Check for first instance of `package.json`

## [3.8.3] - 2022-08-26

### Changed

- `platforms` argument also accepts comma separated (without spaces) values

## [3.8.2] - 2022-08-08

### Added

- Support for multiple file paths

## [3.8.1] - 2022-07-18

### Changed

- Fix regex to match `package.json` _files_ only

## [3.8.0] - 2022-07-11

## Added

- `mode` option which defaults to run
- `nwbuild` function
- `quiet` option to documentation

## Changed

- CLI options by matching them to the API

## [3.7.4] - 2022-06-06

## Removed

- Remove `Version` from `CFBundleShortVersionString` [#576](https://github.com/nwjs-community/nw-builder/pull/576)

## [3.7.2] - 2022-06-02

## Added

- Added options `buildType`, `macCredits`, `macPlist`, `zip`, `zipOptions` to CLI [#575](https://github.com/nwjs-community/nw-builder/pull/575)

## Changed

- Update lint command [#575](https://github.com/nwjs-community/nw-builder/pull/575)

## [3.7.1] - 2022-06-02

## Changed

- Add `EditorConfig` [#574](https://github.com/nwjs-community/nw-builder/pull/574)
- Fix build step for Windows x64 platform [#572](https://github.com/nwjs-community/nw-builder/pull/572)
- Refactor `platforms` object [#571](https://github.com/nwjs-community/nw-builder/pull/571)

## [3.7.0] - 2022-05-30

## Added

- Optional zip file merging for Windows and Linux [#567](https://github.com/nwjs-community/nw-builder/pull/567)
- Add code of conduct [#560](https://github.com/nwjs-community/nw-builder/pull/560)

## Changed

- Update contributing guide [#569](https://github.com/nwjs-community/nw-builder/pull/569)
- Switch from TypeScript to JSDocs [#568](https://github.com/nwjs-community/nw-builder/pull/568)
- Set window icon with `rcedit` [#566](https://github.com/nwjs-community/nw-builder/pull/566)
- Refactor `checkCache` [#565](https://github.com/nwjs-community/nw-builder/pull/565)
- Simplify demo
- Refactor `detectCurrentPlatform` [#564](https://github.com/nwjs-community/nw-builder/pull/564)
- Update dependencies [#561](https://github.com/nwjs-community/nw-builder/pull/561) [#532](https://github.com/nwjs-community/nw-builder/pull/532)

## Removed

## [3.6.0] - 2022-05-18

### Added

- GitHub Actions for CICD [#552](https://github.com/nwjs-community/nw-builder/pull/552)
- Support multiple locales on OSX [#389](https://github.com/nwjs-community/nw-builder/pull/389)
- Pull request and issue template [#553](https://github.com/nwjs-community/nw-builder/pull/553)

### Changed

- Dependencies [#550](https://github.com/nwjs-community/nw-builder/pull/550)
- Documentation [#540](https://github.com/nwjs-community/nw-builder/pull/540) [#553](https://github.com/nwjs-community/nw-builder/pull/553) [#555](https://github.com/nwjs-community/nw-builder/pull/555)
- Improve run mode by detecting current platform to prevent downloading additional binaries

### Removed

- Travis
- AppVeyor
- JSHint
- EditorConfig

## [3.5.7]

### Security

- Source platform overrides module into the project instead of it being an extenal dependency. This helped us get rid of a vulnerable lodash version. See https://github.com/nwjs-community/nw-builder/issues/500

## [3.5.1] - 2017-10-19

### Added

- Add option.winVersionString for accurate process name. See https://github.com/nwjs-community/nw-builder/pull/459.

### Fixed

- Small platform overrides fix. See https://github.com/nwjs-community/nw-builder/pull/477/files.

## [3.4.1] - 2017-06-05

### Removed

- The `bluebird` dependency. We're now using native promises instead.

## [3.4.0] - 2017-05-28

### Added

- If using the package programmatically and it's out of date, a message will be shown (this was always the case for the CLI).
- There is now a README in every directory (with at least a single sentence summarizing the directory) to help with onboarding contributors.

### Changed

- Some dependencies are updated.

### Removed

- `osx32` is removed from the default list of platforms. Thanks to [@preaction](https://github.compreaction) (PR [#439](https://github.com/nwjs-community/nw-builder/pull/439)).
- An unnecessary `rcedit` dependency is removed.

### Fixed

- For Node 7+ users, you won't see a `os.tmpDir` deprecation warning anymore.

---

## Old format

- 2017-05-22 `3.2.3` Fix for caching when a version is specified (thanks @piwonesien for the help).
- 2017-05-20 `3.2.2` Fix: when using the `nwbuild` in run mode, the `-p` option was ignored and the current platform was always used.
- 2017-05-16 `3.2.1` Fix: NW.js 0.22.0+ apps didn't open.
- 2017-02-12 `3.2.0` Defaults to HTTPS now, added `manifestUrl` option, and bumped some dependencies.
- 2016-10-09 `3.1.2` Fix for passing array as files option when running app (plus some security fixes).
- 2016-10-09 `3.1.1` Fix for flavor feature when using CLI.
- 2016-09-14 `3.1.0` Ability to select any flavor of NW.js, not just `sdk`.
- 2016-08-28 `3.0.0` bumping graceful-fs-extra dependency to 2.0.0.
- 2016-08-14 `2.2.7` fix for macIcns option when using NW.js 0.12.3
- 2016-07-31 `2.2.6` fix for OS X caching
- 2016-07-03 `2.2.5` fix for update-notifier usage in bin
- 2016-07-03 `2.2.4` fix for syntax error in CLI
- 2016-07-02 `2.2.3` a few small fixes for the run option and more
- 2016-07-02 `2.2.2` fix for cache check of some legacy versions
- 2016-07-02 `2.2.1` supports newer NW.js versions (via http://nwjs.io/versions.json), plus other fixes.
- 2015-12-18 `2.2.0` added `zip` option.
- 2015-12-06 `2.1.0` added `cacheDir` command-line option, fix for no info being passed back, etc.
- 2015-06-28 `2.0.2` put upper bound to semver check for windows.
- 2015-06-14 `2.0.1` safer validation of versions.
- 2015-06-14 `2.0.0` changed to nw-builder, etc.
- 2015-05-05 `1.0.12` when using latest NW.js version, it's first validated that it's not an alpha version (fixes [#222](https://github.com/nwjs/nw-builder/issues/222)). Plus a fix for the `winIco` & `macIcns` command line options
- 2015-01-29 `1.0.8` fixed EMFILE errors (see [#147](https://github.com/nwjs/nw-builder/issues/147) [#148](https://github.com/nwjs/nw-builder/pull/148))
- 2015-01-21 `1.0.7` fixed about screen when copyright is not supplied
- 2015-01-15 `1.0.6` fixed downloads for nw.js version 0.12.0-alpha1
- 2015-01-15 `1.0.5` fixed downloads for NW.js versions < 0.12.0-alpha
- 2014-12-12 `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors.
- 2014-12-07 `0.4.0` macPlist CFBundleIdentifier is generated from `package.json` (see [#131](https://github.com/nwjs/nw-builder/pull/131))
- 2014-11-14 `0.3.0` macPlist option improvements (see [#96](https://github.com/nwjs/nw-builder/pull/96))
- 2014-10-30 `0.2.0` adds support for platform-specific manifest overrides (see [#94](https://github.com/nwjs/nw-builder/pull/94))
- 2014-08-19 `0.1.2` adds a progress bar to downloads, fixes downloading through a proxy, fixed winIco, bug fixes
- 2014-08-01 `0.1.0` use app filename for generated executables, optimized version checking, (known issue: `winIco` on windows)
- 2014-07-31 `0.0.4` fixed compatibility with nodewebkit 0.10.0
- 2014-04-20 Added run option, bug fixes
- 2014-04-13 Preview Release
