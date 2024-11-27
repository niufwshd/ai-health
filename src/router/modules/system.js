/* Layout */
import Layout from "@/layout";

const sysRouter = {
  path: "/system",
  component: Layout,
  redirect: "/system/list",
  name: "system",
  meta: {
    title: "系统管理",
    icon: "user",
    roles: ["admin", "system:management"], // you can set roles in root nav
  },
  children: [
    {
      path: "sys-department",
      component: () =>
        import("@/views/system/sys-department/sys-department-list"),
      name: "sysDepartmentList",
      meta: {
        title: "部门管理",
        icon: "departList",
        roles: ["admin", "sys:department:management"],
      },
    },
    {
      path: "sys-user-list",
      component: () => import("@/views/system/sys-user/sys-user-list"),
      name: "sysUserList",
      meta: {
        title: "用户管理",
        icon: "yonhu",
        roles: ["admin", "sys:user:management"], // you can set roles in root nav
      },
    },
    {
      path: "sys-role-list",
      component: () => import("@/views/system/sys-role/sys-role-list"),
      name: "sysRoleList",
      meta: {
        title: "角色管理",
        icon: "juese",
        roles: ["admin", "sys:role:management"], // you can set roles in root nav
      },
    },
    {
      path: "sys-menu-list",
      component: () => import("@/views/system/sys-menu/sys-menu-list"),
      name: "sysMenuList",
      meta: {
        title: "菜单管理",
        icon: "menuList",
        roles: ["admin", "sys:permission:management"], // you can set roles in root nav
      },
    },
    {
      path: "sys-role-menu/:id(\\d+)",
      component: () => import("@/views/system/sys-role/sys-role-menu"),
      name: "sysRoleMenu",
      meta: {
        title: "角色权限设置",
        roles: ["admin", "sys:role:management"], // you can set roles in root nav
        noCache: false,
      },
      hidden: true,
    },
    {
      path: "sys-dict-list",
      component: () => import("@/views/system/sys-dict/sys-dict-list"),
      name: "sysDictList",
      meta: { title: "参数设置", icon: "set" },
    },
  ],
};
export default sysRouter;
