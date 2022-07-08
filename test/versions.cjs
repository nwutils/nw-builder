var test = require("tape"),
  nock = require("nock");

var versions = require("../lib/versions.cjs");

var root = "http://nwjs.io";
var dlUrl = "http://dl.nwjs.io/";
var expectedLegacyVersions = ["0.10.2", "0.10.0-rc1", "0.9.3"];

test("getLatestVersion", async function (t) {
  await t.plan(3);

  nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");
  nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");

  await versions
    .getLatestVersion("http://dl.nwjs.io/", root + "/versions.json")
    .then(function (result) {
      t.equal(result.version, "0.15.2");
      t.equal(result.name, "nwjs");
      t.deepEqual(result.platforms, {
        "linux32-normal":
          "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-linux-ia32.tar.gz",
        "linux32-sdk":
          "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-linux-ia32.tar.gz",
        "linux64-normal":
          "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-linux-x64.tar.gz",
        "linux64-sdk":
          "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-linux-x64.tar.gz",
        "osx64-normal": "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-osx-x64.zip",
        "osx64-sdk": "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-osx-x64.zip",
        "win32-normal": "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-win-ia32.zip",
        "win32-sdk": "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-win-ia32.zip",
        "win64-normal": "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-win-x64.zip",
        "win64-sdk": "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-win-x64.zip",
      });
    });
});

test("getVersions", async function (t) {
  await t.plan(6);

  await nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");
  await nock(dlUrl)
    .get("/")
    .replyWithFile(200, "./test/fixtures/testVersions.html");
  await expectedLegacyVersions.forEach(function (expectedVersion) {
    nock(dlUrl)
      .head(
        "/v" +
          expectedVersion +
          "/node-webkit-v" +
          expectedVersion +
          "-win-ia32.zip",
      )
      .replyWithFile(200, "./test/fixtures/testVersions.html"); // needs to reply with *any* content
  });

  await versions
    .getVersions(dlUrl, root + "/versions.json")
    .then(function (result) {
      var expectedVersions = [
        {
          version: "0.15.2",
          name: "nwjs",
          platforms: {
            "linux32-normal":
              "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-linux-ia32.tar.gz",
            "linux32-sdk":
              "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-linux-ia32.tar.gz",
            "linux64-normal":
              "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-linux-x64.tar.gz",
            "linux64-sdk":
              "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-linux-x64.tar.gz",
            "osx64-normal":
              "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-osx-x64.zip",
            "osx64-sdk":
              "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-osx-x64.zip",
            "win32-normal":
              "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-win-ia32.zip",
            "win32-sdk":
              "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-win-ia32.zip",
            "win64-normal":
              "http://dl.nwjs.io/v0.15.2/nwjs-v0.15.2-win-x64.zip",
            "win64-sdk":
              "http://dl.nwjs.io/v0.15.2/nwjs-sdk-v0.15.2-win-x64.zip",
          },
          isLegacy: false,
        },
        {
          version: "0.13.2",
          name: "nwjs",
          platforms: {
            "linux32-nacl":
              "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-linux-ia32.tar.gz",
            "linux32-normal":
              "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-linux-ia32.tar.gz",
            "linux32-sdk":
              "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-linux-ia32.tar.gz",
            "osx64-nacl":
              "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-osx-x64.zip",
            "osx64-normal":
              "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-osx-x64.zip",
            "osx64-sdk":
              "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-osx-x64.zip",
            "win64-nacl":
              "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-win-x64.zip",
            "win64-normal":
              "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-win-x64.zip",
            "win64-sdk":
              "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-win-x64.zip",
          },
          isLegacy: false,
        },
        {
          version: "0.12.3",
          name: "nwjs",
          platforms: {
            "linux32-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-ia32.tar.gz",
            "linux32-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-ia32.tar.gz",
            "linux64-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz",
            "linux64-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz",
            "osx32-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-ia32.zip",
            "osx32-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-ia32.zip",
            "osx64-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-x64.zip",
            "osx64-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-osx-x64.zip",
            "win32-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip",
            "win32-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-ia32.zip",
            "win64-macappstore":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-x64.zip",
            "win64-normal":
              "http://dl.nwjs.io/v0.12.3/nwjs-v0.12.3-win-x64.zip",
          },
          isLegacy: false,
        },
        {
          version: "0.10.2",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-linux-x64.tar.gz",
            "osx32-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-osx-ia32.zip",
            "osx64-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-osx-x64.zip",
            "win32-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-win-ia32.zip",
            "win64-sdk":
              "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-win-x64.zip",
          },
          isLegacy: true,
        },
        {
          version: "0.10.0-rc1",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-linux-x64.tar.gz",
            "osx32-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-osx-ia32.zip",
            "osx64-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-osx-x64.zip",
            "win32-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-win-ia32.zip",
            "win64-sdk":
              "http://dl.nwjs.io/v0.10.0-rc1/node-webkit-v0.10.0-rc1-win-x64.zip",
          },
          isLegacy: true,
        },
        {
          version: "0.9.3",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-linux-x64.tar.gz",
            "osx32-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-osx-ia32.zip",
            "osx64-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-osx-x64.zip",
            "win32-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-win-ia32.zip",
            "win64-sdk":
              "http://dl.nwjs.io/v0.9.3/node-webkit-v0.9.3-win-x64.zip",
          },
          isLegacy: true,
        },
      ];

      for (var i = 0; i < expectedVersions.length; i++) {
        t.deepEqual(result[i], expectedVersions[i]);
      }
    })
    .catch(function (err) {
      console.error(err.stack);
      t.fail(err);
    });
});

test("getVersions (custom download URL)", async function (t) {
  await t.plan(6);

  await nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");
  await nock("http://abc.xyz/")
    .get("/")
    .replyWithFile(200, "./test/fixtures/testVersions.html");
  await expectedLegacyVersions.forEach(function (expectedVersion) {
    nock("http://abc.xyz/")
      .head(
        "/v" +
          expectedVersion +
          "/node-webkit-v" +
          expectedVersion +
          "-win-ia32.zip",
      )
      .replyWithFile(200, "./test/fixtures/testVersions.html"); // needs to reply with *any* content
  });

  await versions
    .getVersions("http://abc.xyz/", root + "/versions.json")
    .then(function (result) {
      var expectedVersions = [
        {
          version: "0.15.2",
          name: "nwjs",
          platforms: {
            "linux32-normal":
              "http://abc.xyz/v0.15.2/nwjs-v0.15.2-linux-ia32.tar.gz",
            "linux32-sdk":
              "http://abc.xyz/v0.15.2/nwjs-sdk-v0.15.2-linux-ia32.tar.gz",
            "linux64-normal":
              "http://abc.xyz/v0.15.2/nwjs-v0.15.2-linux-x64.tar.gz",
            "linux64-sdk":
              "http://abc.xyz/v0.15.2/nwjs-sdk-v0.15.2-linux-x64.tar.gz",
            "osx64-normal": "http://abc.xyz/v0.15.2/nwjs-v0.15.2-osx-x64.zip",
            "osx64-sdk": "http://abc.xyz/v0.15.2/nwjs-sdk-v0.15.2-osx-x64.zip",
            "win32-normal": "http://abc.xyz/v0.15.2/nwjs-v0.15.2-win-ia32.zip",
            "win32-sdk": "http://abc.xyz/v0.15.2/nwjs-sdk-v0.15.2-win-ia32.zip",
            "win64-normal": "http://abc.xyz/v0.15.2/nwjs-v0.15.2-win-x64.zip",
            "win64-sdk": "http://abc.xyz/v0.15.2/nwjs-sdk-v0.15.2-win-x64.zip",
          },
          isLegacy: false,
        },
        {
          version: "0.13.2",
          name: "nwjs",
          platforms: {
            "linux32-nacl":
              "http://abc.xyz/v0.13.2/nwjs-nacl-v0.13.2-linux-ia32.tar.gz",
            "linux32-normal":
              "http://abc.xyz/v0.13.2/nwjs-v0.13.2-linux-ia32.tar.gz",
            "linux32-sdk":
              "http://abc.xyz/v0.13.2/nwjs-sdk-v0.13.2-linux-ia32.tar.gz",
            "osx64-nacl":
              "http://abc.xyz/v0.13.2/nwjs-nacl-v0.13.2-osx-x64.zip",
            "osx64-normal": "http://abc.xyz/v0.13.2/nwjs-v0.13.2-osx-x64.zip",
            "osx64-sdk": "http://abc.xyz/v0.13.2/nwjs-sdk-v0.13.2-osx-x64.zip",
            "win64-nacl":
              "http://abc.xyz/v0.13.2/nwjs-nacl-v0.13.2-win-x64.zip",
            "win64-normal": "http://abc.xyz/v0.13.2/nwjs-v0.13.2-win-x64.zip",
            "win64-sdk": "http://abc.xyz/v0.13.2/nwjs-sdk-v0.13.2-win-x64.zip",
          },

          isLegacy: false,
        },
        {
          version: "0.12.3",
          name: "nwjs",
          platforms: {
            "linux32-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-linux-ia32.tar.gz",
            "linux32-normal":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-linux-ia32.tar.gz",
            "linux64-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz",
            "linux64-normal":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-linux-x64.tar.gz",
            "osx32-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-osx-ia32.zip",
            "osx32-normal": "http://abc.xyz/v0.12.3/nwjs-v0.12.3-osx-ia32.zip",
            "osx64-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-osx-x64.zip",
            "osx64-normal": "http://abc.xyz/v0.12.3/nwjs-v0.12.3-osx-x64.zip",
            "win32-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-win-ia32.zip",
            "win32-normal": "http://abc.xyz/v0.12.3/nwjs-v0.12.3-win-ia32.zip",
            "win64-macappstore":
              "http://abc.xyz/v0.12.3/nwjs-v0.12.3-win-x64.zip",
            "win64-normal": "http://abc.xyz/v0.12.3/nwjs-v0.12.3-win-x64.zip",
          },
          isLegacy: false,
        },
        {
          version: "0.10.2",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-linux-x64.tar.gz",
            "osx32-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-osx-ia32.zip",
            "osx64-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-osx-x64.zip",
            "win32-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-win-ia32.zip",
            "win64-sdk":
              "http://abc.xyz/v0.10.2/node-webkit-v0.10.2-win-x64.zip",
          },
          isLegacy: true,
        },
        {
          version: "0.10.0-rc1",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-linux-x64.tar.gz",
            "osx32-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-osx-ia32.zip",
            "osx64-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-osx-x64.zip",
            "win32-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-win-ia32.zip",
            "win64-sdk":
              "http://abc.xyz/v0.10.0-rc1/node-webkit-v0.10.0-rc1-win-x64.zip",
          },
          isLegacy: true,
        },
        {
          version: "0.9.3",
          name: "node-webkit",
          platforms: {
            "linux32-sdk":
              "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-linux-ia32.tar.gz",
            "linux64-sdk":
              "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-linux-x64.tar.gz",
            "osx32-sdk":
              "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-osx-ia32.zip",
            "osx64-sdk": "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-osx-x64.zip",
            "win32-sdk":
              "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-win-ia32.zip",
            "win64-sdk": "http://abc.xyz/v0.9.3/node-webkit-v0.9.3-win-x64.zip",
          },
          isLegacy: true,
        },
      ];

      for (var i = 0; i < expectedVersions.length; i++) {
        t.deepEqual(result[i], expectedVersions[i]);
      }
    })
    .catch(function (err) {
      console.error(err.stack);
      t.fail(err);
    });
});

test("getVersion", async function (t) {
  await t.plan(3);

  await nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");
  await versions
    .getVersion({
      desiredVersion: "0.13.2",
      downloadUrl: "http://dl.nwjs.io/",
      manifestUrl: root + "/versions.json",
    })
    .then(function (result) {
      t.equal(result.version, "0.13.2");
      t.equal(result.name, "nwjs");
      t.deepEqual(result.platforms, {
        "linux32-nacl":
          "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-linux-ia32.tar.gz",
        "linux32-normal":
          "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-linux-ia32.tar.gz",
        "linux32-sdk":
          "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-linux-ia32.tar.gz",
        "osx64-nacl": "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-osx-x64.zip",
        "osx64-normal": "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-osx-x64.zip",
        "osx64-sdk": "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-osx-x64.zip",
        "win64-nacl": "http://dl.nwjs.io/v0.13.2/nwjs-nacl-v0.13.2-win-x64.zip",
        "win64-normal": "http://dl.nwjs.io/v0.13.2/nwjs-v0.13.2-win-x64.zip",
        "win64-sdk": "http://dl.nwjs.io/v0.13.2/nwjs-sdk-v0.13.2-win-x64.zip",
      });
    });
});

test("getVersion should fail for non-existent version", async function (t) {
  await t.plan(1);

  await nock(root)
    .get("/versions.json")
    .replyWithFile(200, "./test/fixtures/manifest/versions.json");
  await versions
    .getVersion({
      desiredVersion: "0.13.3",
      downloadUrl: "http://dl.nwjs.io/",
      manifestUrl: root + "/versions.json",
    })
    .then(function () {
      t.fail("Shouldn't go in here");
    })
    .catch(function () {
      t.ok("Should fail");
    });
});

test("getVersion (legacy)", async function (t) {
  await t.plan(3);

  await nock(dlUrl)
    .get("/")
    .replyWithFile(200, "./test/fixtures/testVersions.html");
  await nock(dlUrl)
    .head("/v0.10.2/node-webkit-v0.10.2-win-ia32.zip")
    .replyWithFile(200, "./test/fixtures/testVersions.html"); // needs to reply with *any* content

  await versions
    .getVersion({
      desiredVersion: "0.10.2",
      downloadUrl: "http://dl.nwjs.io/",
      flavor: "sdk",
    })
    .then(function (result) {
      t.equal(result.version, "0.10.2");
      t.equal(result.name, "node-webkit");
      t.deepEqual(result.platforms, {
        "linux32-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-linux-ia32.tar.gz",
        "linux64-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-linux-x64.tar.gz",
        "osx32-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-osx-ia32.zip",
        "osx64-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-osx-x64.zip",
        "win32-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-win-ia32.zip",
        "win64-sdk":
          "http://dl.nwjs.io/v0.10.2/node-webkit-v0.10.2-win-x64.zip",
      });
    })
    .catch(function (err) {
      t.end(err);
    });
});

test("getVersion (legacy) should fail for non-existent version", async function (t) {
  await t.plan(1);

  await nock(dlUrl)
    .get("/")
    .replyWithFile(200, "./test/fixtures/testVersions.html");
  await versions
    .getVersion({
      desiredVersion: "0.10.1",
      downloadUrl: "http://dl.nwjs.io/",
    })
    .then(function () {
      t.fail("shouldn't go in here");
    })
    .catch(function () {
      t.ok("Should fail");
    });
});
