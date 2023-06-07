import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { AI_PROMPT, Client, HUMAN_PROMPT } from "@anthropic-ai/sdk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

const apiKey = process.env.REACT_APP_CLAUDE_KEY;
if (!apiKey) {
  throw new Error("The ANTHROPIC_API_KEY environment variable must be set");
}

function App() {

  interface Section {
    title: string,
    content: string

  }

  let client: Client | null = null
  if (apiKey) {
    client = new Client(apiKey);
  }
  const [title, setTitle] = useState("")
  const [sections, setSections] = useState<Section[]>([{ title: '', content: '' }]);
  const [completion, setCompletion] = useState("")


  useEffect(() => {

  }, [])


  const handleSectionChange = (field: 'title' | 'content', value: string, index: number) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newSections = [...sections];
    newSections.push({ title: '', content: '' })
    setSections(newSections)
  }

  const handleBrainstorm = () => {
    if (client) {
      let prompt = `${HUMAN_PROMPT} You will work with me in our collaborative writing endeavor, while taking great care ensuring safety in the content generated. The content generated must be safe from harmful contents, such as violence, sex, swear words, hate speech, warmongering, and other harmful text. You will give strict and severe warning should I in any way include said harmful contents in my prompts. ${AI_PROMPT} Understood, I will do my best to ensure the content safety. ${HUMAN_PROMPT} Now please give me revisions based on the title and sections I write to you, the title is ${title}`
      sections.map((s: Section) => {
        prompt += `section title: ${s.title}; section content: ${s.content}`
      })
      client
        .complete({
          prompt,
          stop_sequences: [HUMAN_PROMPT],
          max_tokens_to_sample: 200,
          model: "claude-v1.3-100k",
        })
        .then((finalSample) => {
          console.log(finalSample.completion);
          setCompletion(finalSample.completion)
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
        <h1 className='font-bold text-2xl mb-6 text-center'>Write with Claude</h1>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <label htmlFor="title" className='text-sm font-semibold'>Title</label>
              <input id="title" type="text" className='border p-2 w-full' value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            {sections.map((v: Section, i: number) => (
              <div key={`section_${i}`} className='space-y-2'>
                <div className='flex gap-2'>
                  <label htmlFor={`section_${i}`} className='text-sm font-semibold'>Section: </label>
                  <input
                    id={`title_${i}`}
                    type="text"
                    className='border p-2 w-full'
                    value={v.title}
                    onChange={(event) => handleSectionChange('title', event.target.value, i)}
                  />
                </div>
                <textarea
                  id={`section_${i}`}
                  onChange={(event) => handleSectionChange('content', event.target.value, i)}
                  className='border p-2 w-full'
                  value={v.content}
                  cols={30}
                  rows={5}
                />
              </div>
            ))}
            <div className='flex w-full gap-2'>
              <div onClick={handleAddSection} className='flex hover:cursor-pointer w-8/12 bg-amber-700 items-center gap-2 rounded-sm px-2 py-1 text-sm text-slate-200'>
                <FontAwesomeIcon icon={faPlusCircle} />
                <p>Add new section.</p>
              </div>
              <div onClick={handleBrainstorm} className='bg-emerald-600 hover:cursor-pointer flex items-center gap-2 w-4/12 text-slate-200 text-sm rounded-sm py-3 px-2'>
                <FontAwesomeIcon icon={faStarOfLife} />
                <p>Brainstorm</p>
              </div>
            </div>
          </div>
          <div className='p-4 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600'>
            {completion ? 
            <div>{completion}</div>
            : 
            <div>Get started with collaborative writing with Claude!</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
