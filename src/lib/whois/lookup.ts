import { MAX_IP_WHOIS_FOLLOW, MAX_WHOIS_FOLLOW } from "@/lib/env";
import whois from "whois-raw";
import { WhoisResult } from "@/lib/whois/types";
import { parseWhoisData } from "@/lib/whois/tld_parser";
import { countDuration, extractDomain, toErrorMessage } from "@/lib/utils";
import { getJsonRedisValue, setJsonRedisValue } from "@/lib/server/redis";

export function getLookupOptions(domain: string) {
  const isDomain = !!extractDomain(domain);
  const options: any = {
    follow: isDomain ? MAX_WHOIS_FOLLOW : MAX_IP_WHOIS_FOLLOW,
  };
  
  // 添加自定义WHOIS服务器映射
  if (domain.endsWith('.ing')) {
    options.server = 'whois.nic.google';
  }
  else if (domain.endsWith('.page')) {
    options.server = 'whois.nic.google';
  }
  else if (domain.endsWith('.new')) {
    options.server = 'whois.nic.google';
  }
  else if (domain.endsWith('.shop')) {
    options.server = 'whois.nic.shop';
  }
  
  return options;
}

export function getLookupRawWhois(
  domain: string,
  options?: any,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      whois.lookup(domain, options, (err: Error, data: string) => {
        if (err) {
          // reject err like tld error
          reject(err);
        } else {
          resolve(data);
        }
      });
    } catch (e) {
      // reject err like connection error
      reject(e);
    }
  });
}
export async function lookupWhois(domain: string): Promise<WhoisResult> {
  const startTime = Date.now();

  try {
    const options = getLookupOptions(domain);
    const data = await getLookupRawWhois(domain, options);
    const endTime = Date.now();
    
    // 检查是否是"refer"格式（IANA格式），如果是则尝试二次查询
    if (data.includes('% IANA WHOIS server') && data.includes('refer:')) {
      const referMatch = data.match(/refer:\s+([^\s]+)/);
      if (referMatch && referMatch[1]) {
        const referServer = referMatch[1].trim();
        console.log(`[whois] Redirecting to refer server: ${referServer}`);
        
        try {
          const referOptions = { ...options, server: referServer };
          const referData = await getLookupRawWhois(domain, referOptions);
          const endTime = Date.now();
          const parsed = parseWhoisData(referData, domain);
          
          return {
            status: true,
            time: countDuration(startTime, endTime),
            result: parsed,
          };
        } catch (referErr) {
          console.error(`[whois] Refer server lookup failed:`, referErr);
          // 如果二次查询失败，使用原始数据
        }
      }
    }
    
    const parsed = parseWhoisData(data, domain);

    return {
      status: true,
      time: countDuration(startTime, endTime),
      result: parsed,
    };
  } catch (e) {
    return {
      status: false,
      time: countDuration(startTime),
      error: toErrorMessage(e),
    };
  }
}

export async function lookupWhoisWithCache(
  domain: string,
): Promise<WhoisResult> {
  const key = `whois:${domain}`;
  const cached = await getJsonRedisValue<WhoisResult>(key);
  if (cached) {
    return {
      ...cached,
      time: 0,
      cached: true,
    };
  }

  const result = await lookupWhois(domain);
  if (result.status) {
    await setJsonRedisValue<WhoisResult>(key, result);
  }

  return {
    ...result,
    cached: false,
  };
}
