# TokenAware
A [Chrome extension](https://chrome.google.com/webstore/detail/tokenaware/ngcligbdheofopbokngenlgdpalociaf) to count tokens within OpenAI's GPT-3 Playground
It's 100% client-side so no data is being sent to any server.

The token calculation is an estimate, based on the assumption that 1 token equals 4 characters.

## Load as a local extension
1. Clone this repository into a local directory
2. Navigate to [chrome://extensions](chrome://extensions)
3. Click `Load unpacked` at the top-left corner
4. Choose the directory from step 1
5. Navigate to the [Playground environment](https://beta.openai.com/playground) (log in if needed)
6. You should now see the 'Usage costs' text next to the *_Playground_* title 

## Future
Consider using [Hugging Face's GPT-2 Output Detector](https://huggingface.co/openai-detector) as a workaround for a more precise token count by querying and then selecting the `used_tokens` variable. 
