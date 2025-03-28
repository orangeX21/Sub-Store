import { Base64 } from 'js-base64';
import { Result, isPresent } from './utils';
import Surge_Producer from './surge';
import ClashMeta_Producer from './clashmeta';
import { isIPv4, isIPv6 } from '@/utils';
import $ from '@/core/app';

const targetPlatform = 'SurgeMac';

const surge_Producer = Surge_Producer();

export default function SurgeMac_Producer() {
    const produce = (proxy, type, opts = {}) => {
        // 总是默认使用mihomo
        opts.useMihomoExternal = true;
        
        switch (proxy.type) {
            case 'external':
                return external(proxy);
            default: {
                // SurgeMac平台完全使用mihomo作为外部代理处理所有协议
                $.info(`Using mihomo for ${proxy.name} (${proxy.type})`);
                return mihomo(proxy, type, opts);
            }
        }
    };
    return { produce };
}

function external(proxy) {
    const result = new Result(proxy);
    if (!proxy.exec || !proxy['local-port']) {
        throw new Error(`${proxy.type}: exec and local-port are required`);
    }
    result.append(
        `${proxy.name}=external,exec="${proxy.exec}",local-port=${proxy['local-port']}`,
    );

    if (Array.isArray(proxy.args)) {
        proxy.args.map((args) => {
            result.append(`,args="${args}"`);
        });
    }
    if (Array.isArray(proxy.addresses)) {
        proxy.addresses.map((addresses) => {
            result.append(`,addresses=${addresses}`);
        });
    }

    result.appendIfPresent(
        `,no-error-alert=${proxy['no-error-alert']}`,
        'no-error-alert',
    );

    // tfo
    if (isPresent(proxy, 'tfo')) {
        result.append(`,tfo=${proxy['tfo']}`);
    } else if (isPresent(proxy, 'fast-open')) {
        result.append(`,tfo=${proxy['fast-open']}`);
    }

    // test-url
    result.appendIfPresent(`,test-url=${proxy['test-url']}`, 'test-url');

    // block-quic
    result.appendIfPresent(`,block-quic=${proxy['block-quic']}`, 'block-quic');

    return result.toString();
}

function mihomo(proxy, type, opts) {
    const clashProxy = ClashMeta_Producer().produce([proxy], 'internal')?.[0];
    if (clashProxy) {
        const localPort = opts?.localPort || proxy._localPort || 65535;
        const ipv6 = ['ipv4', 'v4-only'].includes(proxy['ip-version'])
            ? false
            : true;
        const external_proxy = {
            name: proxy.name,
            type: 'external',
            exec: proxy._exec || '/usr/local/bin/mihomo',
            'local-port': localPort,
            args: [
                '-config',
                Base64.encode(
                    JSON.stringify({
                        'mixed-port': localPort,
                        ipv6,
                        mode: 'global',
                        dns: {
                            enable: true,
                            ipv6,
                            'default-nameserver': opts?.defaultNameserver ||
                                proxy._defaultNameserver || [
                                    '180.76.76.76',
                                    '52.80.52.52',
                                    '119.28.28.28',
                                    '223.6.6.6',
                                ],
                            nameserver: opts?.nameserver ||
                                proxy._nameserver || [
                                    'https://doh.pub/dns-query',
                                    'https://dns.alidns.com/dns-query',
                                    'https://doh-pure.onedns.net/dns-query',
                                ],
                        },
                        proxies: [
                            {
                                ...clashProxy,
                                name: 'proxy',
                            },
                        ],
                        'proxy-groups': [
                            {
                                name: 'GLOBAL',
                                type: 'select',
                                proxies: ['proxy'],
                            },
                        ],
                    }),
                ),
            ],
            addresses: [],
        };

        // https://manual.nssurge.com/policy/external-proxy.html
        if (isIP(proxy.server)) {
            external_proxy.addresses.push(proxy.server);
        } else {
            $.info(
                `Platform ${targetPlatform}, proxy type ${proxy.type}: addresses should be an IP address, but got ${proxy.server}. Resolving hostname will be handled by mihomo.`,
            );
        }
        opts.localPort = localPort - 1;
        return external(external_proxy);
    } else {
        throw new Error(`Failed to convert ${proxy.name} (${proxy.type}) to ClashMeta format`);
    }
}

function isIP(ip) {
    return isIPv4(ip) || isIPv6(ip);
}
