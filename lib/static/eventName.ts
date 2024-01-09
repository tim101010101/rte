export enum EventType {
  MOUSE,
  KEYBOARD,

  INNER,
}

export enum VNodeEventName {
  CLICK = 'click',
  INPUT = 'input',
  KEYDOWN = 'keydown',
  KEYUP = 'keyup',
  MOUSE_DOWN = 'mousedown',
  MOUSE_MOVE = 'mousemove',
  MOUSE_UP = 'mouseup',
  WHEEL = 'wheel',
}

export enum InnerEventName {
  FULL_PATCH = 'full_patch',

  FOCUS_ON = 'focus_on',
  UNFOCUS = 'unfocus',
  CURSOR_MOVE = 'cursor_move',
  NEW_LINE = 'new_line',

  UPDATE_BLOCK_CONTENT = 'update_block_content',
  DELETE_BLOCK_CONTENT = 'delete_block_content',

  BUILD_BLOCK = 'build_block',
  UNINSTALL_BLOCK = 'uninstall_block',
  INSTALL_BLOCK = 'install_block',
}
