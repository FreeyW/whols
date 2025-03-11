import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import { toast } from "sonner";
import { getDomain } from "tldjs";
import { ParsedUrlQuery } from "node:querystring";
import { getSpecialDomain } from "@/lib/whois/lib";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEnter(e: React.KeyboardEvent) {
  // compatible with MacOS
  return e.key === "Enter" && e.keyCode !== 229;
}

export function saveAsFile(filename: string, content: string) {
  /**
   * Save text as file
   * @param filename Filename
   * @param content File content
   * @example
   * saveAsFile("hello.txt", "Hello world!");
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob
   */

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content]));
  a.download = filename;
  a.click();
}

async function copyClipboard(text: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return await navigator.clipboard.writeText(text);
  }

  const el = document.createElement("textarea");
  el.value = text;
  // android may require editable
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, text.length);
  document.execCommand("copy");
  document.body.removeChild(el);
}

export function useClipboard() {
  /**
   * Use clipboard
   * @example
   * const copy = useClipboard();
   * copy("Hello world!");
   */

  return async (text: string) => {
    try {
      await copyClipboard(text);
      toast.success("Copied!");
    } catch (e) {
      console.error(e);

      const err = e as Error;
      toast.error(`Failed to copy: ${err.message}`);
    }
  };
}

export function useSaver() {
  return (filename: string, content: string) => {
    try {
      saveAsFile(filename, content);
      toast.success("Saved!");
    } catch (e) {
      console.error(e);

      toast.error(`Failed to save: ${toErrorMessage(e)}`);
    }
  };
}

export function toSearchURI(query: string) {
  const q = query.trim();
  return q ? `/${encodeURIComponent(q)}` : "/";
}

export function toReadableISODate(date: string | null): { dateTime: string; timeZone: string } {
  if (!date) return { dateTime: "Unknown", timeZone: "" };
  
  try {
    // 从ISO字符串创建Date对象
    const dateObj = new Date(date);
    
    // 单独格式化日期部分
    const datePart = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    
    // 单独格式化时间部分
    const timePart = dateObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false // 使用24小时制
    });
    
    // 获取时区偏移量
    const timeZoneOffset = dateObj.getTimezoneOffset();
    const timeZoneSign = timeZoneOffset <= 0 ? '+' : '-';
    const timeZoneHours = Math.abs(Math.floor(timeZoneOffset / 60));
    const timeZoneMinutes = Math.abs(timeZoneOffset % 60);
    const timeZone = `GMT${timeZoneSign}${timeZoneHours.toString().padStart(2, '0')}${timeZoneMinutes > 0 ? ':' + timeZoneMinutes.toString().padStart(2, '0') : ''}`;
    
    // 返回日期时间和时区分开
    return {
      dateTime: `${datePart} ${timePart}`,
      timeZone: timeZone
    };
  } catch (e) {
    // 如果解析出错，返回原始格式
    return {
      dateTime: date.replace("T", " ").replace("Z", "").replace(".000", ""),
      timeZone: ""
    };
  }
}

export function filterRepeat<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function includeArgs(from: string, ...args: string[]): boolean {
  return args.some((arg) => from.toLowerCase().includes(arg.toLowerCase()));
}

export function toErrorMessage(e: any): string {
  return e.message || "Unknown error";
}

export function countDuration(startTime: number, _endTime?: number): number {
  const endTime = _endTime ?? Date.now();
  return (endTime - startTime) / 1000; // seconds
}

export function extractDomain(url: string): string | null {
  try {
    return getDomain(getSpecialDomain(url));
  } catch {
    return null;
  }
}

export function cleanDomain(domain: string): string {
  const hostname = extractDomain(domain);
  if (hostname) {
    return hostname;
  }

  // if contains ip, extract it and return
  const ipMatch = domain.match(
    /^(https?:\/\/)?((\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/,
  );
  if (ipMatch) {
    return ipMatch[2];
  }

  return domain;
}

export function cleanDomainQuery(query: ParsedUrlQuery): string {
  const domain =
    (query.query as string | string[] | undefined)?.toString() ?? "";

  return cleanDomain(domain);
}

export function getWindowHref(): string {
  // if in server side, return empty string
  if (typeof window === "undefined") return "";

  return window.location.href;
}
