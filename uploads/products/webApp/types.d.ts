declare module 'cloudflare:sockets' {
  export class Socket {
    public readonly readable: any
    public readonly writable: any
    public readonly closed: Promise<void>
    public close(): Promise<void>
    public startTls(options: TlsOptions): Socket
  }

  export type TlsOptions = {
    expectedServerHostname?: string
  }

  export type SocketAddress = {
    hostname: string
    port: number
  }

  export type SocketOptions = {
    secureTransport?: 'off' | 'on' | 'starttls'
    allowHalfOpen?: boolean
  }

  export function connect(address: string | SocketAddress, options?: SocketOptions): Socket
}
	blackBright: Formatter
	redBright: Formatter
	greenBright: Formatter
	yellowBright: Formatter
	blueBright: Formatter
	magentaBright: Formatter
	cyanBright: Formatter
	whiteBright: Formatter

	bgBlackBright: Formatter
	bgRedBright: Formatter
	bgGreenBright: Formatter
	bgYellowBright: Formatter
	bgBlueBright: Formatter
	bgMagentaBright: Formatter
	bgCyanBright: Formatter
	bgWhiteBright: Formatter
}
