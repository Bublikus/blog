const AccessControl = require('accesscontrol')
const { user } = require('../config')

const ac = new AccessControl()

exports.roles = (() => {
  ac.grant(user.userRoles.guest)
    .readAny('post')
    .readAny('comment')
    .readAny('profile')

  ac.grant(user.userRoles.user)
    .extend(user.userRoles.guest)
    .readOwn('profile')
    .updateOwn('profile')
    .deleteOwn('profile')
    .createOwn('comment')
    .deleteOwn('comment')
    .createOwn('like')
    .deleteOwn('like')

  ac.grant(user.userRoles.editor)
    .extend(user.userRoles.user)
    .createOwn('post')
    .updateOwn('post')
    .deleteOwn('post')

  ac.grant(user.userRoles.admin)
    .extend(user.userRoles.editor)
    .createAny('profile')
    .updateAny('profile')
    .deleteAny('profile')
    .createAny('post')
    .updateAny('post')
    .deleteAny('post')
    .createAny('comment')
    .updateAny('comment')
    .deleteAny('comment')
    .createAny('like')
    .updateAny('like')
    .deleteAny('like')

  return ac
})()
