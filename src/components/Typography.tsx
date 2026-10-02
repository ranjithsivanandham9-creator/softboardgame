import React from 'react'
import { clsx } from 'clsx'

interface TypographyProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Display({ children, className, as: Component = 'h1' }: TypographyProps) {
  return <Component className={clsx('text-display', className)}>{children}</Component>
}

export function H1({ children, className, as: Component = 'h1' }: TypographyProps) {
  return <Component className={clsx('text-h1', className)}>{children}</Component>
}

export function H2({ children, className, as: Component = 'h2' }: TypographyProps) {
  return <Component className={clsx('text-h2', className)}>{children}</Component>
}

export function H3({ children, className, as: Component = 'h3' }: TypographyProps) {
  return <Component className={clsx('text-h3', className)}>{children}</Component>
}

export function ButtonText({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-button', className)}>{children}</Component>
}

export function Body({ children, className, as: Component = 'p' }: TypographyProps) {
  return <Component className={clsx('text-body', className)}>{children}</Component>
}

export function BodyStrong({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-body-strong', className)}>{children}</Component>
}

export function Label({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-label', className)}>{children}</Component>
}

export function Stat({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-stat', className)}>{children}</Component>
}

export function Ticker({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-ticker', className)}>{children}</Component>
}

export function Dialog({ children, className, as: Component = 'p' }: TypographyProps) {
  return <Component className={clsx('text-dialog', className)}>{children}</Component>
}

export function Badge({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-badge', className)}>{children}</Component>
}

export function Caption({ children, className, as: Component = 'span' }: TypographyProps) {
  return <Component className={clsx('text-caption', className)}>{children}</Component>
}

export const Typography = {
  Display,
  H1,
  H2,
  H3,
  ButtonText,
  Body,
  BodyStrong,
  Label,
  Stat,
  Ticker,
  Dialog,
  Badge,
  Caption,
}