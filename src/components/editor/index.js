// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import PropTypes from 'prop-types'

const TextEditor = ({toolbar}) => {
  // ** State
  const [value, setValue] = useState(EditorState.createEmpty())

  return (
    <>
      <Editor
        toolbar={toolbar}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorState={value}
        onEditorStateChange={(data) => setValue(data)}
      />
    </>
  )
}

export default TextEditor

TextEditor.propTypes = {
  toolbar: PropTypes.object
}
