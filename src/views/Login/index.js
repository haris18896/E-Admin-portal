/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'

// third party components
import * as Yup from 'yup'
import classNames from 'classnames'

import { useFormik } from 'formik'
import { useSkin } from '@hooks/useSkin'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// components
import useJwt from '@src/auth/jwt/useJwt'
import themeConfig from '@configs/themeConfig'
import InputPasswordToggle from '@components/input-password-toggle'

// ** utils
import { isObjEmpty } from '@utils'

// ** context
import { AbilityContext } from '@src/utility/context/Can'


// ** Reactstrap imports
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Spinner
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/authentication.scss'

// ** actions
import { login } from '@store/authentication/authAction'

function Login() {
  const skin = useSkin()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const ability = useContext(AbilityContext)


  const { loginInProgress } = useSelector((state) => state.auth)

  const LoginAdminSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is a required field!'),
    password: Yup.string().required('Password is a required field!')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginAdminSchema,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        const { email, password } = values
        const data = {
          email: email.trim(),
          password: password.trim()
        }
        dispatch(login({data, ability, navigate}))
      }
    }
  })

  // return loginInProgress ? (
  //   <Spinner />
  // ) : (
  return (
    <div className="bg-ethera">
      <div className="auth-wrapper h-100vh auth-basic px-2 ">
        <div className="auth-inner py-2">
          <Card className="auth-inner mb-0">
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                {skin === 'dark' ? (
                  <img
                    src={themeConfig.app.appLogoImage}
                    alt="logo-dark"
                    height="150px"
                  />
                ) : (
                  <img
                    src={themeConfig.app.appLogoImage}
                    alt="logo-dark"
                    height="150px"
                  />
                )}
              </Link>
              <CardTitle tag="h4" className="mb-2 text-center">
                Admin Login
              </CardTitle>
              <Form
                name="login-form"
                className="auth-login-form mt-2"
                onSubmit={formik.handleSubmit}
              >
                <FormGroup className="minHeightInput marginBottom-1">
                  <Label className="form-label" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="admin@example.com"
                    {...formik.getFieldProps('email')}
                    className={classNames({
                      'radius-25 skin-change': true,
                      'is-invalid': formik.touched.email && formik.errors.email
                    })}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormFeedback className="ml-1">
                      {formik.errors.email}
                    </FormFeedback>
                  )}
                </FormGroup>

                <FormGroup className="minHeightInput marginBottom-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" htmlFor="password">
                      Password
                    </Label>
                  </div>
                  <InputPasswordToggle
                    id="password"
                    name="password"
                    {...formik.getFieldProps('password')}
                    inputClassName="radius-25 skin-change"
                    className={classNames({
                      'input-group-merge': true,
                      'is-invalid':
                        formik.touched.password && formik.errors.password
                    })}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormFeedback className="ml-1">
                      {formik.errors.password}
                    </FormFeedback>
                  )}
                </FormGroup>

                <Button
                  disabled={loginInProgress}
                  className="button-primary mb-1 padding-Four-side"
                  type="submit"
                  block
                >
                  <Spinner
                    size="sm"
                    className={classNames({
                      'd-none': !loginInProgress
                    })}
                  />
                  <span className="px-1">Sign In</span>
                </Button>
              </Form>

              <div className="my-2 d-flex align-items-center justify-content-between">
                <p
                  className="floatRight"
                  onClick={() => navigate('/forgot-password')}
                >
                  <span className="link">Forgot Password</span>
                </p>

                <p htmlFor="terms">
                  New to Ethera?
                  <span className="link" onClick={() => navigate('/register')}>
                    {' '}
                    Register{' '}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
