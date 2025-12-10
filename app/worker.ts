import { pipeline, env, type PipelineType, type TextClassificationPipeline } from "@huggingface/transformers";

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task: PipelineType = 'text-classification';
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance: TextClassificationPipeline | null = null;

    static async getInstance(progress_callback?: (progress: unknown) => void): Promise<TextClassificationPipeline> {
        if (this.instance === null) {
            this.instance = (await pipeline(this.task, this.model, { progress_callback })) as TextClassificationPipeline;
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    let classifier = await PipelineSingleton.getInstance((x: unknown) => {
        self.postMessage(x);
    });

    if (!classifier) {
        self.postMessage({
            status: 'error',
            message: 'Classifier pipeline could not be initialized.',
        });
        return;
    }

    let output = await classifier(event.data.text);

    self.postMessage({
        status: 'complete',
        output: output,
    });
});
