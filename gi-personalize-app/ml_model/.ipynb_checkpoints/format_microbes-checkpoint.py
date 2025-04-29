import pandas as pd
import matplotlib.pyplot as plt

def read_format_save_and_plot(input_path, output_path):
    # Read the tab-separated file
    df = pd.read_csv(input_path, sep='\t', header=None)

    # Assign generic column names if none exist
    df.columns = [f'Column_{i+1}' for i in range(df.shape[1])]

    # Fill missing values with 'N/A'
    df.fillna('N/A', inplace=True)

    # Format numeric columns to 5 decimal places for neatness
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='ignore')
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].apply(lambda x: f"{x:.5f}" if isinstance(x, float) or isinstance(x, int) else x)

    # Save to a new CSV file
    df.to_csv(output_path, index=False)
    print(f"Formatted CSV saved as: {output_path}")

    # For plotting, convert back to numeric (ignore non-numeric)
    df_numeric = pd.read_csv(output_path)
    for col in df_numeric.columns:
        df_numeric[col] = pd.to_numeric(df_numeric[col], errors='coerce')

    # Plot the first 5 columns as line plots
    plt.figure(figsize=(12, 6))
    for col in df_numeric.columns[1:6]:  # skip the first column if it's an index or ID
        plt.plot(df_numeric.index, df_numeric[col], label=col)
    plt.title('Line Plot of First Five Columns')
    plt.xlabel('Row Index')
    plt.ylabel('Value')
    plt.legend()
    plt.tight_layout()
    plt.show()

# Usage example
read_format_save_and_plot('sample_microbiome.csv', 'formatted_output.csv')

