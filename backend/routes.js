const KeywordsController = require("./Controllers/KeywordsController");
const AuthenticationController = require("./Controllers/AuthenticationController");
const TechnologySupply = require("./Controllers/TechnologySupply");

const ROUTES = [
  {
    method: "get",
    url: "/getUpDownSupplyTrend",
    func: TechnologySupply.getUpDownSupplyTrend,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getTopSupply",
    func: TechnologySupply.getTopSupply,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getAllSupply",
    func: TechnologySupply.getAllSupply,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getAllSupplyTechnologies",
    func: TechnologySupply.getAllSupplyTechnologies,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getUpDownDemandTrend",
    func: KeywordsController.getUpDownDemandTrend,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getTopTechnologies",
    func: KeywordsController.getTopTechnologies,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getCrawlingStats",
    func: KeywordsController.getCrawlingStats,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getRole",
    func: AuthenticationController.getRole,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getLastDemandData",
    func: KeywordsController.getLastDemandData,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getLastSupplyData",
    func: TechnologySupply.getLastSupplyData,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getAllKeywords",
    func: KeywordsController.getAllKeywords,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getDefaultAnalysis",
    func: KeywordsController.getDefaultAnalysis,
    middleware: AuthenticationController.protect,
  },
  {
    method: "delete",
    url: "/deleteAnalysis",
    func: KeywordsController.deleteAnalysis,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getAllUsers",
    func: AuthenticationController.getAllUsers,
    middleware: AuthenticationController.protect,
    restrict: AuthenticationController.restrict("admin"),
  },
  {
    method: "get",
    url: "/getOneAnalysis",
    func: KeywordsController.getOneAnalysis,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getAllAnalysis",
    func: KeywordsController.getAllAnalysis,
    middleware: AuthenticationController.protect,
  },
  {
    method: "post",
    url: "/addNewAnalysis",
    func: KeywordsController.addNewAnalysis,
    middleware: AuthenticationController.protect,
  },
  {
    method: "get",
    url: "/getDefaultKeywords",
    func: KeywordsController.getDefaultKeywords,
    middleware: AuthenticationController.protect,
  },
  {
    method: "post",
    url: "/addDefaultKeywords",
    func: KeywordsController.addDefaultKeywords,
    middleware: AuthenticationController.protect,
  },
  {
    method: "delete",
    url: "/deleteDefaultKeywords",
    func: KeywordsController.deleteDefaultKeywords,
    middleware: AuthenticationController.protect,
  },
  {
    method: "post",
    url: "/addNewUser",
    func: AuthenticationController.addNewUser,
    middleware: AuthenticationController.protect,
    restrict: AuthenticationController.restrict("admin"),
  },
  {
    method: "post",
    url: "/login",
    func: AuthenticationController.login,
  },
  {
    method: "post",
    url: "/logout",
    func: AuthenticationController.logout,
  },
  {
    method: "delete",
    url: "/deleteUser",
    func: AuthenticationController.deleteUser,
    middleware: AuthenticationController.protect,
    restrict: AuthenticationController.restrict("admin"),
  },
];

module.exports = {
  ROUTES,
};

//   {
//     method: 'get',
//     url: "/analysis/:id",
//     func: KeywordsController.addNewAnalysis, // -> get analysis
//     middleware: AuthenticationController.protect,
//   }
