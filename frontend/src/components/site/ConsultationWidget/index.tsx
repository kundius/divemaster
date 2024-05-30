'use client'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PrimaryButton, PrimaryButtonArrow } from '../PrimaryButton'
import styles from './index.module.scss'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'

interface Fields {
  name: string
  phone: string
  message: string
  email: string
  rules: boolean
}

export function ConsultationWidget() {
  const [showSuccess, setShowSuccess] = useState(false)
  const form = useForm<Fields>({
    defaultValues: {
      name: '',
      phone: '',
      message: '',
      email: '',
      rules: true
    }
  })

  async function onSubmit(values: Fields) {
    if (!values.rules) {
      form.setError('rules', {
        message: 'Необходимо согласиться с политикой обработки персональных данных'
      })
      return
    }

    console.log(values)

    setShowSuccess(true)
  }

  function closeSuccessHandler() {
    setShowSuccess(false)

    form.reset()
  }

  return (
    <Form {...form}>
      <div className={styles.widget}>
        <div className={styles.frame}>
          {showSuccess ? (
            <div className={styles.success}>
              <div className={styles.successTop}>Спасибо!</div>
              <div className={styles.successIcon} />
              <div className={styles.successTitle}>Ваша заявка успешно отправлена.</div>
              <div className={styles.successDesc}>В ближайшее время с Вами свяжется менеджер и уточнит все детали</div>
              <div className={styles.successButton}>
                <PrimaryButton variant="outline" onClick={closeSuccessHandler}>
                  Закрыть <PrimaryButtonArrow />
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.title}>Заказать Бесплатную консультацию</div>
              <div className={styles.field}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          className={styles.input}
                          placeholder="Введите Ваше имя"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.field}>
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    required: 'Необходимо указать телефон для обратной связи'
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="tel"
                          className={styles.input}
                          placeholder="Телефон*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.field}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          className={styles.input}
                          placeholder="E-mail"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.field}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          {...field}
                          className={styles.textarea}
                          placeholder="Задайте Ваш вопрос"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.field}>
                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <label className={styles.rules}>
                          <input
                            {...field}
                            type="checkbox"
                            value="1"
                            defaultChecked
                            className={styles.rulesInput}
                          />
                          <span className={styles.rulesControl} />
                          <span className={styles.rulesText}>
                            Соглашаюсь с{' '}
                            <Link href="/">Политикой обработки персональных данных</Link>
                          </span>
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.submit}>
                <PrimaryButton type="submit" size="sm">
                  Отправить <PrimaryButtonArrow />
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </Form>
  )
}
