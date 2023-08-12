import { gsap } from 'gsap';
import { CustomEase } from 'gsap/all';

gsap.registerPlugin(CustomEase);

export const DEFAULT = CustomEase.create('default', '0.77, 0, 0.175, 1');
export const CSS = 'cubic-bezier(0.77, 0, 0.175, 1)';
