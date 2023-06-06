import React from 'react'
// hooks
import useMediaQuery from '@hooks/useMediaQuery'
// ** Reactstrap Imports
import { Label } from 'reactstrap'
// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, UploadCloud } from 'react-feather'

function SignatureUpload({ file, onChange, error }) {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (accepted, rejected) => {
      if (rejected.length) {
        toast.error('You can only upload image Files!.')
      }
      if (accepted.length) {
        onChange(accepted[0])
      }
    }
  })

  const mobile = useMediaQuery('(max-width: 600px)')

  const renderFilePreview = (file) => {
    if (file) {
      return (
        <label {...getRootProps()} style={{ cursor: 'pointer' }}>
          <img
            className="contained"
            alt={file.name}
            src={URL.createObjectURL(file)}
            height={mobile ? 130 : 150}
            width={mobile ? 250 : 300}
          />
        </label>
      )
    } else {
      return <FileText size="28" />
    }
  }

  const UploadFileRenderer = () => (
    <div
      {...getRootProps({ className: 'dropzone' })}
      className="signature_modal--block white-border"
    >
      <input
        id="inputProp"
        name="inputProp"
        {...getInputProps()}
        disabled
        accept="image/*"
      />
      <div className="d-flex align-items-center justify-content-center flex-column">
        <strong>Signature Image</strong>
        <UploadCloud size={64} />
        <span className="text-success">Drag a photo of your Signature</span>
        <p className="text-secondary">
          or{' '}
          <a href="/" onClick={(e) => e.preventDefault()}>
            browse
          </a>{' '}
          for a file to upload
        </p>
        {error && <Label className="mt-1 text-danger">{error}</Label>}
      </div>
    </div>
  )

  return (
    <div>
      <Label className="pl-10px">Preview</Label>
      {!file && UploadFileRenderer()}
      {file && error && UploadFileRenderer()}

      {file && !error && (
        <>
          <div className="signature_modal--preview">
            {renderFilePreview(file)}
          </div>
        </>
      )}
    </div>
  )
}

export default SignatureUpload
