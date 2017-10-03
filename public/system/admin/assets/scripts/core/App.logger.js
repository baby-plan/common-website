/* ========================================================================
 * App.logger v1.0
 * 日志记录插件
 * ========================================================================
 * Copyright 2016-2026 WangXin nvlbs,Inc.
 * 
 * ======================================================================== */
(function (app) {
  /**根据日志级别记录日志
   * @param {string} level 日志级别：INFO,ERROR,WARN,DEBUG
   * @param {string} text  日志内容
   */
  var output = function (level, text) {

    if (cfgs.output) {
      var date = App.util.dateformat(new Date(), "yyyy-MM-dd HH:mm:ss");
      if (level == "INFO ") {
        console.info(date + " [" + level + "] " + text);
      } else if (level == "ERROR") {
        console.error(date + " [" + level + "] " + text);
      } else if (level == "WARN ") {
        console.warn(date + " [" + level + "] " + text);
      } else if (level == "DEBUG") {
        console.debug(date + " [" + level + "] " + text);
      } else {
        console.log(date + " [" + level + "] " + text);
      }
      // console.trace(date + " [" + level + "] " + text);
    }
  }
  /// <field type="logger">日志记录器对象.</field> 
  app.logger = {
    /**以DEBUG级别输出内容
     * @param {string} text  日志内容
     */
    "debug": function (text) {
        if (cfgs.output.debug) {
          output("DEBUG", text);
        }
      }
      /**以WARN级别输出内容
       * @param {string} text  日志内容
       */
      ,
    "warn": function (text) {
        if (cfgs.output.warn) {
          output("WARN ", text);
        }
      }
      /**以INFO级别输出内容
       * @param {string} text  日志内容
       */
      ,
    "info": function (text) {
        if (cfgs.output.info) {
          output("INFO ", text);
        }
      }
      /**以ERROR级别输出内容
       * @param {string} text  日志内容
       */
      ,
    "error": function (text) {
      if (cfgs.output.error) {
        output("ERRPR", text);
      }
    }
  }
})(App);