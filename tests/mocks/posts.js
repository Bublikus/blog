const privatePost = {
  id: '1',
  title: 'My Very First Post Title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  user_id: '1',
  private: true,
  likes: 0,
  is_liked: true,
  created_at: '2021-04-13T19:59:41.000Z',
  updated_at: '2021-04-13T19:59:41.000Z',
}

const publicPost = {
  id: '2',
  title: 'The Second Post',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  user_id: '2',
  private: false,
  likes: 0,
  is_liked: true,
  created_at: '2021-04-13T19:59:41.000Z',
  updated_at: '2021-04-13T19:59:41.000Z',
}

module.exports = {
  privatePost,
  publicPost,
}
