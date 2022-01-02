
export abstract class AbstractGenerator {
    abstract generateUncached(): any;
    protected generatedValue: any = null;

    generate(): any {
        if (this.generatedValue === null) {
            this.generatedValue = this.generateUncached();
        }

        return this.generatedValue;
    }
}
