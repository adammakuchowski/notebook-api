import {MessageResponse} from './messageResponse'

export interface ErrorResponse extends MessageResponse {
  stack?: unknown
}
