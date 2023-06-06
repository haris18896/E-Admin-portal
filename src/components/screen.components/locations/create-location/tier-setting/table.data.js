import classNames from 'classnames'
import FormGroupElement from '@FormGroupElement'

/* eslint-disable no-unused-vars */
export const columns = ({ formik }) => {
  return [
    {
      name: 'Tier',
      sortable: false,
      minWidth: '700px',
      cell: (row, index) => {
        return (
          <input
            name={`tiers-${index}`}
            id={`tiers-${index}`}
            type="text"
            disabled
            defaultValue={formik.values.tier_setting?.[`${index}`]?.tier}
            className={classNames({
              'form-control mb-0 border-none shadow-none bg-transparent color-blue': true,
              'in-valid':
                formik.touched.tier_setting?.[`${index}`]?.tier &&
                formik.errors.tier_setting?.[`${index}`]?.tier
            })}
            placeholder="Enter Tier Name"
            {...formik.getFieldProps(`tier_setting[${index}].tier`)}
          />
        )
      }
    },
    {
      name: 'From (Hours)',
      sortable: false,
      cell: (row, index) => (
        <FormGroupElement
          required
          type="number"
          labelClassName="pl-10px"
          placeholder="Start Hours"
          disabled
          name={`tier_setting.${index}.start_hours`}
          inputClassName="form-fields radius-25 skin-change pd-s"
          formGroupClassName="mt-1 wd-90px"
          value={formik.values?.tier_setting?.[index]?.start_hours}
          formikTouchedClass={
            formik.touched?.tier_setting?.[index]?.start_hours
          }
          formikErrorClass={formik.errors?.tier_setting?.[index]?.start_hours}
        />
      )
    },
    {
      name: 'To (Hours)',
      sortable: false,
      cell: (row, index) => (
        <FormGroupElement
          required
          type="number"
          labelClassName="pl-10px"
          placeholder="End Hours"
          name={`tier_setting.${index}.end_hours`}
          inputClassName="form-fields radius-25 skin-change pd-s"
          formGroupClassName="mt-1 wd-90px"
          value={formik.values?.tier_setting?.[index]?.end_hours}
          onChange={(e) => {
            formik.setFieldValue(
              `tier_setting[${index}].end_hours`,
              e.target.value
            )

            if (index < formik.values.tier_setting.length - 1) {
              formik.setFieldValue(
                `tier_setting.${index + 1}.start_hours`,
                parseInt(e.target.value) + 1
              )
            }
          }}
          formikTouchedClass={formik.touched?.tier_setting?.[index]?.end_hours}
          formikErrorClass={formik.errors?.tier_setting?.[index]?.end_hours}
        />
      )
    }
  ]
}
