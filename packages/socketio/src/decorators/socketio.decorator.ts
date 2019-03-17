// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  ClassDecoratorFactory,
  Constructor,
  inject,
  MetadataAccessor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/context';

export interface SocketIOMetadata {
  namespace?: string | RegExp;
}

export const SOCKETIO_METADATA = MetadataAccessor.create<
  SocketIOMetadata,
  ClassDecorator
>('socketio');

/**
 * Decorate a socketio controller class to specify the namespace
 * For example,
 * ```ts
 * @socketio({namespace: '/chats'})
 * export class SocketIOController {}
 * ```
 * @param spec A namespace or object
 */
export function socketio(spec: SocketIOMetadata | string | RegExp = {}) {
  if (typeof spec === 'string' || spec instanceof RegExp) {
    spec = {namespace: spec};
  }
  return ClassDecoratorFactory.createDecorator(SOCKETIO_METADATA, spec);
}

export function getSocketIOMetadata(controllerClass: Constructor<unknown>) {
  return MetadataInspector.getClassMetadata(SOCKETIO_METADATA, controllerClass);
}

export namespace socketio {
  export function socket() {
    return inject('socketio.socket');
  }

  /**
   * Decorate a method to subscribe to socketio events.
   * For example,
   * ```ts
   * @socketio.subscribe('chat message')
   * async function onChat(msg: string) {
   * }
   * ```
   * @param messageTypes
   */
  export function subscribe(...messageTypes: (string | RegExp)[]) {
    return MethodDecoratorFactory.createDecorator(
      'socketio:subscribe',
      messageTypes,
    );
  }

  /**
   * Decorate a controller method for `disconnect`
   */
  export function disconnect() {
    return subscribe('disconnect');
  }

  /**
   * Decorate a controller method for `connect`
   */
  export function connect() {
    return MethodDecoratorFactory.createDecorator('socketio:connect', true);
  }
}