const { user: userConfig } = require('../../src/config')

const admin = {
  id: '1',
  username: 'John_Doe',
  role_id: userConfig.userRoles.admin,
  avatar_id: '1',
  created_at: '2021-04-13T19:59:41.000Z',
  updated_at: '2021-04-13T19:59:41.000Z'
}

const editor = {
  id: '2',
  username: 'Edward_Le',
  role_id: userConfig.userRoles.editor,
  avatar_id: '2',
  created_at: '2021-04-13T19:59:41.000Z',
  updated_at: '2021-04-13T19:59:41.000Z'
}

const user = {
  id: '3',
  username: 'Raphael_Amigo',
  role_id: userConfig.userRoles.user,
  avatar_id: '3',
  created_at: '2021-04-13T19:59:41.000Z',
  updated_at: '2021-04-13T19:59:41.000Z'
}

const guest = {
  role_id: userConfig.userRoles.guest,
}

module.exports = {
  admin,
  editor,
  user,
  guest,
}
