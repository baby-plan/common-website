define(["cfgs", "core/core-modules/framework.event"], function (cfgs, event) {

  cfgs.powers = [];
  // EVENT-ON:layout.logined
  event.on("layout.logined", function tmp_powers(info) {

    if (info.args.account == 'user1') {
      //业务管理视角
      cfgs.powers = [
        {
          "id": "HOME",
          "actions": []
        },

        {
          "id": "USER_ACTIVE_TOTAL",
          "actions": [
            "USER_ACTIVE_TOTAL_EXPORT"
          ]
        },
        {
          "id": "MCH_ACTIVE_TOTAL",
          "actions": [
            "MCH_ACTIVE_TOTAL_EXPORT"
          ]
        },
        {
          "id": "MCH_SUCCESS_RATE",
          "actions": [
            "MCH_SUCCESS_RATE_EXPORT"
          ]
        },
        {
          "id": "MCH_SIGN",
          "actions": [
            "MCH_SIGN_EXPORT"
          ]
        },
        {
          "id": "MCH_SIGN_DETAIL",
          "actions": [
            "MCH_SIGN_DETAIL_EXPORT"
          ]
        },
        {
          "id": "PARTNER_MANAGMENT",
          "actions": [
            "PARTNER_MANAGMENT_INSERT",
            "PARTNER_MANAGMENT_UPDATE",
            "PARTNER_MANAGMENT_DELETE",
            "PARTNER_MANAGMENT_EXPORT",
            "PARTNER_MANAGEMENT_RESETPASSWORD"
          ]
        }
      ]
    } else if (info.args.account == 'user2') {
      //系统管理视角
      cfgs.powers = [
        {
          "id": "HOME",
          "actions": []
        },
        {
          "id": "ACCOUNT_MANAGMENT",
          "actions": [
            "ACCOUNT_MANAGMENT_INSERT",
            "ACCOUNT_MANAGMENT_UPDATE",
            "ACCOUNT_MANAGMENT_DELETE",
            "ACCOUNT_MANAGMENT_EXPORT"
          ]
        },
        {
          "id": "ROLE_MANAGMENT",
          "actions": [
            "ROLE_MANAGMENT_INSERT",
            "ROLE_MANAGMENT_UPDATE",
            "ROLE_MANAGMENT_DELETE",
            "ROLE_MANAGMENT_EXPORT"
          ]
        },
        {
          "id": "AREA_MANAGMENT",
          "actions": [
            "AREA_MANAGEMENT_INSERT",
            "AREA_MANAGEMENT_UPDATE",
            "AREA_MANAGEMENT_DELETE",
            "AREA_MANAGEMENT_EXPORT"
          ]
        },
        {
          "id": "CODE_MANAGEMENT",
          "actions": [
            "CODE_MANAGEMENT_INSERT",
            "CODE_MANAGEMENT_UPDATE",
            "CODE_MANAGEMENT_DELETE",
            "CODE_MANAGEMENT_EXPORT"
          ]
        },
        {
          "id": "SYS_LOG",
          "actions": [
            "SYS_LOG_EXPORT"
          ]
        },
        {
          "id": "MCH_NOTICE", "actions": [
            "MCH_NOTICE_INSERT",
            "MCH_NOTICE_UPDATE",
            "MCH_NOTICE_DELETE",
            "MCH_NOTICE_SUBMIT",
            "MCH_NOTICE_AUDIT",
            "MCH_NOTICE_PUBLISH",
            "MCH_NOTICE_UNPUBLISH",
          ]
        },
        {
          "id": "SYS_MONITOR",
          "actions": []
        }
      ]
    } else if (info.args.account == 'user3') {
      // 合作方视角
      cfgs.powers = [
        {
          "id": "HOME",
          "actions": []
        },
        {
          "id": "MCH_MANAGEMENT",
          "actions": [
            "MCH_MANAGEMENT_INSERT",
            "MCH_MANAGEMENT_UPDATE",
            "MCH_MANAGEMENT_DELETE",
            "MCH_MANAGEMENT_EXPORT",
            "MCH_MANAGEMENT_PUBLISH",
            "MCH_MANAGEMENT_UNPUBLISH",
            "MCH_MANAGEMENT_RESETPASSWORD"
          ]
        },
        {
          "id": "MCH_SERVICE_MANAGEMENT",
          "actions": [
            "MCH_SERVICE_MANAGEMENT_INSERT",
            "MCH_SERVICE_MANAGEMENT_UPDATE",
            "MCH_SERVICE_MANAGEMENT_DELETE",
            "MCH_SERVICE_MANAGEMENT_EXPORT",
            "MCH_SERVICE_MANAGEMENT_CHECH"
          ]
        },
        {
          "id": "MCH_HISTORY",
          "actions": [
            "MCH_HISTORY_EXPORT"
          ]
        },
        {
          "id": "USER_HISTORY",
          "actions": [
            "USER_HISTORY_EXPORT"
          ]
        },
        {
          "id": "ORDER_SEARCH",
          "actions": [
            "ORDER_SEARCH_EXPORT"
          ]
        },
        {
          "id": "SETTLE_REPORT",
          "actions": [
            "SETTLE_REPORT_EXPORT"
          ]
        },
        {
          "id": "TICKET_SEARCH",
          "actions": [
            "TICKET_SEARCH_EXPORT"
          ]
        }
      ]
    } else if (info.args.account == 'debug'
      || info.args.account == 'wangxin') {
      // 开发人员视角
      cfgs.powers = [
        {
          "id": "HOME",
          "actions": []
        },
        {
          "id": "MCH_MANAGEMENT",
          "actions": [
            "MCH_MANAGEMENT_INSERT",
            "MCH_MANAGEMENT_UPDATE",
            "MCH_MANAGEMENT_DELETE",
            "MCH_MANAGEMENT_EXPORT",
            "MCH_MANAGEMENT_SUBMIT",
            "MCH_MANAGEMENT_AUDIT",
            "MCH_MANAGEMENT_PUBLISH",
            "MCH_MANAGEMENT_UNPUBLISH",
            "MCH_MANAGEMENT_RESETPASSWORD"
          ]
        },
        {
          "id": "MCH_SERVICE_MANAGEMENT",
          "actions": [
            "MCH_SERVICE_MANAGEMENT_INSERT",
            "MCH_SERVICE_MANAGEMENT_UPDATE",
            "MCH_SERVICE_MANAGEMENT_DELETE",
            "MCH_SERVICE_MANAGEMENT_EXPORT",
            "MCH_SERVICE_MANAGEMENT_SUBMIT",
            "MCH_SERVICE_MANAGEMENT_AUDIT"
          ]
        },
        {
          "id": "MCH_HISTORY",
          "actions": [
            "MCH_HISTORY_EXPORT"
          ]
        },
        {
          "id": "USER_HISTORY",
          "actions": [
            "USER_HISTORY_EXPORT"
          ]
        },
        {
          "id": "ORDER_SEARCH",
          "actions": [
            "ORDER_SEARCH_EXPORT",
            "ORDER_SEARCH_AUDIT"
          ]
        },
        {
          "id": "SETTLE_REPORT",
          "actions": [
            "SETTLE_REPORT_EXPORT"
          ]
        },
        {
          "id": "TICKET_SEARCH",
          "actions": [
            "TICKET_SEARCH_EXPORT"
          ]
        },
        {
          "id": "USER_ACTIVE_TOTAL",
          "actions": [
            "USER_ACTIVE_TOTAL_EXPORT"
          ]
        },
        {
          "id": "MCH_ACTIVE_TOTAL",
          "actions": [
            "MCH_ACTIVE_TOTAL_EXPORT"
          ]
        },
        {
          "id": "MCH_SUCCESS_RATE",
          "actions": [
            "MCH_SUCCESS_RATE_EXPORT"
          ]
        },
        {
          "id": "MCH_SIGN",
          "actions": [
            "MCH_SIGN_EXPORT"
          ]
        },
        {
          "id": "MCH_SIGN_DETAIL",
          "actions": [
            "MCH_SIGN_DETAIL_EXPORT"
          ]
        },
        {
          "id": "PARTNER_MANAGMENT",
          "actions": [
            "PARTNER_MANAGMENT_INSERT",
            "PARTNER_MANAGMENT_UPDATE",
            "PARTNER_MANAGMENT_DELETE",
            "PARTNER_MANAGMENT_EXPORT",
            "PARTNER_MANAGEMENT_RESETPASSWORD"
          ]
        },
        {
          "id": "ACCOUNT_MANAGMENT",
          "actions": [
            "ACCOUNT_MANAGMENT_INSERT",
            "ACCOUNT_MANAGMENT_UPDATE",
            "ACCOUNT_MANAGMENT_DELETE",
            "ACCOUNT_MANAGMENT_EXPORT"
          ]
        },
        {
          "id": "ROLE_MANAGMENT",
          "actions": [
            "ROLE_MANAGMENT_INSERT",
            "ROLE_MANAGMENT_UPDATE",
            "ROLE_MANAGMENT_DELETE",
            "ROLE_MANAGMENT_EXPORT"
          ]
        },
        {
          "id": "AREA_MANAGMENT",
          "actions": [
            "AREA_MANAGEMENT_INSERT",
            "AREA_MANAGEMENT_UPDATE",
            "AREA_MANAGEMENT_DELETE",
            "AREA_MANAGEMENT_EXPORT"
          ]
        },
        {
          "id": "CODE_MANAGEMENT",
          "actions": [
            "CODE_MANAGEMENT_INSERT",
            "CODE_MANAGEMENT_UPDATE",
            "CODE_MANAGEMENT_DELETE",
            "CODE_MANAGEMENT_EXPORT"
          ]
        },
        {
          "id": "SYS_LOG",
          "actions": [
            "SYS_LOG_EXPORT"
          ]
        },
        {
          "id": "MCH_NOTICE", "actions": [
            "MCH_NOTICE_INSERT",
            "MCH_NOTICE_UPDATE",
            "MCH_NOTICE_DELETE",
            "MCH_NOTICE_SUBMIT",
            "MCH_NOTICE_AUDIT",
            "MCH_NOTICE_PUBLISH",
            "MCH_NOTICE_UNPUBLISH",
          ]
        },
        {
          "id": "SYS_MONITOR",
          "actions": []
        }
      ]
    }

  });
});