import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Avatar } from '@mui/material'

const ImageUploader = ({ onFileChange }) => {
    const [preview, setPreview] = useState(null)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreview(reader.result)
                onFileChange(file)
            }
            reader.readAsDataURL(file)
        }
    }, [onFileChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1
    })

    return (
        <Box {...getRootProps()} sx={{
            border: '2px dashed #ccc',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            mb: 2
        }}>
            <input {...getInputProps()} />
            {preview ? (
                <Avatar src={preview} sx={{ width: 100, height: 100, mx: 'auto' }} />
            ) : (
                <Typography>
                    {isDragActive ? 'Drop the image here' : 'Drag & drop profile image, or click to select'}
                </Typography>
            )}
        </Box>
    )
}

export default ImageUploader