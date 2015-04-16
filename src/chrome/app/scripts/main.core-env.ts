/**
 * background.ts
 *
 * This file must be included *after* the freedom script and manifest are
 * loaded.
 */

/// <reference path='../../../../../third_party/freedom-typings/freedom-core-env.d.ts' />
/// <reference path='../../../../../third_party/typings/chrome/chrome-app.d.ts'/>

import freedom_types = require('freedom.types');

import Chrome_oauth = require('./chrome_oauth');
import ChromeUIConnector = require('./chrome_ui_connector');

export interface OnEmitModule extends freedom_types.OnAndEmit<any,any> {};
export interface OnEmitModuleFactory extends
  freedom_types.FreedomModuleFactoryManager<OnEmitModule> {};

// Remember which handlers freedom has installed.
var connector :ChromeUIConnector;
var uProxyAppChannel :freedom_types.OnAndEmit<any,any>;

freedom('generic_core/freedom-module.json', {
  'logger': 'uproxy-lib/loggingprovider/loggingprovider.json',
  'debug': 'debug',
  'oauth': [() => { return new Chrome_oauth(connector); }]
}).then((uProxyModuleFactory:OnEmitModuleFactory) => {
  uProxyAppChannel = uProxyModuleFactory();
  connector = new ChromeUIConnector(uProxyAppChannel);
});

// Reply to pings from the uproxy website that are checking if the
// application is installed.
chrome.runtime.onMessageExternal.addListener(
    (request:Object, sender:Object,
     sendResponse:(r:{message:string}) => void) => {
        if (request) {
          sendResponse({message: "Application installed."});
        }
        return true;
    });
