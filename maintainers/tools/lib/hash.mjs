import { createHash } from 'node:crypto'
export const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')
