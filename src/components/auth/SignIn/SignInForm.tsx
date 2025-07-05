'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { ReactNode } from 'react'

export type OnSignInPayload = {
    values: SignInFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignIn = (payload: OnSignInPayload) => void

interface SignInFormProps extends CommonProps {
    passwordHint?: string | ReactNode
    setMessage: (message: string) => void
    onSignIn?: OnSignIn
}

type SignInFormSchema = {
    login: string
    password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
    login: z
        .string({ required_error: 'Insira o seu login' })
        .min(1, { message: 'Insira o seu login' }),
    password: z
        .string({ required_error: 'Insira a sua senha' })
        .min(1, { message: 'Insira a sua senha' }),
})

const SignInForm = (props: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { className, setMessage, onSignIn, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
        },
        resolver: zodResolver(validationSchema),
    })

    const handleSignIn = async (values: SignInFormSchema) => {
        if (onSignIn) {
            onSignIn({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignIn)}>
                <FormItem
                    label="Login"
                    invalid={Boolean(errors.login)}
                    errorMessage={errors.login?.message}
                >
                    <Controller
                        name="login"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Senha"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
