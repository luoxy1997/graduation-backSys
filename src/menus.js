/*
* 菜单数据 返回Promise各式，支持前端硬编码、异步获取菜单数据
* */
export default function getMenus(userId) {
    // TODO 根据userId获取菜单数据 或在此文件中前端硬编码菜单
    return Promise.resolve([
        {key: 'user-center', local: 'user-center', text: '上传积分商品', icon: 'user', path: '/user-center', order: 600},
        {key: 'user-center2', local: 'user-center2', text: '商品中心', icon: 'user', path: '/course', order: 600},
        {key: 'user-c12enter2', local: 'user-center21', text: '积分商品中心', icon: 'user', path: '/course2', order: 600},
        {key: 'user-c12ent', local: 'user-cednter21', text: '退货审批中心', icon: 'user', path: '/user-center2', order: 600},
    ]);
}
