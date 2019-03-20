var PM_HOST = ''
var PM_API = {
  PROJECT_GROUP: '/pmweb/api/project_group',
  PROJECT_LINK:'/pmweb/api/projectlink',
  IDC_EQUIPMENT: '/pmweb/api/idc/equipment'
}

function getPmHost() {
  return PM_HOST;
}

function getPmApiList() {
  return PM_API;
}

module.exports = {
  getPmHost: getPmHost,
  getPmApiList: getPmApiList
}