import fs from "node:fs/promises";

import plist from "plist";

const setOsxConfig = async (pkg, outDir) => {
  // Rename CFBundleDisplayName in Contents/Info.plist
  let contents_info_plist_path = `${outDir}/nwjs.app/Contents/Info.plist`;
  let contents_info_plist_json = plist.parse(
    await fs.readFile(contents_info_plist_path, "utf-8"),
  );
  contents_info_plist_json.CFBundleDisplayName = pkg.name;
  let contents_info_plist = plist.build(contents_info_plist_json);
  await fs.writeFile(contents_info_plist_path, contents_info_plist);

  // Rename CFBundleDisplayName in Contents/Resources/en.lproj/InfoPlist.strings

  // Rename Helper apps in Contents/Framework.framework/Versions/n.n.n.n/Helpers
  let chromium_version = "107.0.5304.88";
  let helper_app_path_alerts = (name = "nwjs") =>
    `${outDir}/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Versions/${chromium_version}/Helpers/${name} Helper (Alerts).app`;
  let helper_app_path_gpu = (name = "nwjs") =>
    `${outDir}/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Versions/${chromium_version}/Helpers/${name} Helper (GPU).app`;
  let helper_app_path_plugin = (name = "nwjs") =>
    `${outDir}/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Versions/${chromium_version}/Helpers/${name} Helper (Plugin).app`;
  let helper_app_path_renderer = (name = "nwjs") =>
    `${outDir}/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Versions/${chromium_version}/Helpers/${name} Helper (Renderer).app`;
  let helper_app_path = (name = "nwjs") =>
    `${outDir}/nwjs.app/Contents/Frameworks/nwjs Framework.framework/Versions/${chromium_version}/Helpers/${name} Helper.app`;
  await fs.rename(helper_app_path_alerts(), helper_app_path_alerts(pkg.name));
  await fs.rename(helper_app_path_gpu(), helper_app_path_gpu(pkg.name));
  await fs.rename(helper_app_path_plugin(), helper_app_path_plugin(pkg.name));
  await fs.rename(
    helper_app_path_renderer(),
    helper_app_path_renderer(pkg.name),
  );
  await fs.rename(helper_app_path(), helper_app_path(pkg.name));

  let helper_app_alerts_plist_path = `${helper_app_path_alerts(
    pkg.name,
  )}/Contents/Info.plist`;
  let helper_app_gpu_plist_path = `${helper_app_path_gpu(
    pkg.name,
  )}/Contents/Info.plist`;
  let helper_app_plugin_plist_path = `${helper_app_path_plugin(
    pkg.name,
  )}/Contents/Info.plist`;
  let helper_app_render_plist_path = `${helper_app_path_renderer(
    pkg.name,
  )}/Contents/Info.plist`;
  let helper_app_plist_path = `${helper_app_path(
    pkg.name,
  )}/Contents/Info.plist`;

  let helper_app_alerts_plist_json = plist.parse(
    await fs.readFile(helper_app_alerts_plist_path, "utf-8"),
  );
  let helper_app_gpu_plist_json = plist.parse(
    await fs.readFile(helper_app_gpu_plist_path, "utf-8"),
  );
  let helper_app_plugin_plist_json = plist.parse(
    await fs.readFile(helper_app_plugin_plist_path, "utf-8"),
  );
  let helper_app_render_plist_json = plist.parse(
    await fs.readFile(helper_app_render_plist_path, "utf-8"),
  );
  let helper_app_plist_json = plist.parse(
    await fs.readFile(helper_app_plist_path, "utf-8"),
  );

  helper_app_alerts_plist_json.CFBundleDisplayName = pkg.name;
  helper_app_gpu_plist_json.CFBundleDisplayName = pkg.name;
  helper_app_render_plist_json.CFBundleDisplayName = pkg.name;
  helper_app_plugin_plist_json.CFBundleDisplayName = pkg.name;
  helper_app_plist_json.CFBundleDisplayName = pkg.name;

  let helper_app_alerts_plist = plist.build(helper_app_alerts_plist_json);
  let helper_app_gpu_plist = plist.build(helper_app_gpu_plist_json);
  let helper_app_render_plist = plist.build(helper_app_render_plist_json);
  let helper_app_plugin_plist = plist.build(helper_app_plugin_plist_json);
  let helper_app_plist = plist.build(helper_app_plist_json);

  await fs.writeFile(helper_app_alerts_plist_path, helper_app_alerts_plist);
  await fs.writeFile(helper_app_gpu_plist_path, helper_app_gpu_plist);
  await fs.writeFile(helper_app_plugin_plist_path, helper_app_plugin_plist);
  await fs.writeFile(helper_app_render_plist_path, helper_app_render_plist);
  await fs.writeFile(helper_app_plist_path, helper_app_plist);
};

export { setOsxConfig };
