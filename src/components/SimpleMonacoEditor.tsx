import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

interface SimpleMonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  theme?: string;
  language?: string;
  loading?: React.ReactNode;
  error?: React.ReactNode;
}

const SimpleMonacoEditor: React.FC<SimpleMonacoEditorProps> = ({
  value,
  onChange,
  height = '400px',
  theme = 'vs-light',
  language = 'html',
  loading,
  error
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorMount = (editor: any, monaco: any) => {
    try {
      console.log('Monaco Editor mounted successfully');
      setIsLoading(false);
      setHasError(false);
      
      // 简单配置
      if (monaco) {
        monaco.languages.html.htmlDefaults.setOptions({
          suggest: { stopAtSuggestion: true }
        });
      }
    } catch (err) {
      console.error('Monaco Editor mount error:', err);
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleEditorDidNotMount = () => {
    console.error('Monaco Editor failed to mount');
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return error || (
      <div style={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fff2f0',
        border: '1px solid #ffccc7',
        borderRadius: '4px',
        color: '#cf1322',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h3>编辑器加载失败</h3>
          <p>请刷新页面重试，或者联系技术支持</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorMount}
      onDidNotMount={handleEditorDidNotMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        readOnly: false,
        selectOnLineNumbers: true,
        tabSize: 2,
        insertSpaces: true,
      }}
      loading={loading || (
        <div style={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '4px'
        }}>
          <div>正在加载编辑器...</div>
        </div>
      )}
    />
  );
};

export default SimpleMonacoEditor;
