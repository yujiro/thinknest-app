import { app } from 'electron'
import isDev from 'electron-is-dev'
import dev from './development'
import stg from './staging'
import prod from './production'

export default function config() {
  if (!app.isPackaged) {
    return dev
  }

  if (isDev) {
    return stg
  }

  return prod
}
