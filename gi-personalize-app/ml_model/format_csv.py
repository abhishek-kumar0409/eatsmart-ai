import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

def load_and_clean_meals_data(file_path):
    """
    Load and clean the sample_meals.csv file
    
    Parameters:
    file_path (str): Path to the CSV file
    
    Returns:
    pd.DataFrame: Cleaned DataFrame
    dict: Summary information including column groups
    """
    print(f"Reading file from: {file_path}")
    
    # Read the CSV file
    try:
        df = pd.read_csv(file_path, index_col=0)
        print(f"Successfully loaded data with {df.shape[0]} rows and {df.shape[1]} columns")
    except Exception as e:
        print(f"Error reading file: {e}")
        return None, None
    
    # Convert column names to more readable format
    df.columns = [col.replace('person_clinic_', 'clinic_')
                 .replace('person_affinity_', 'blood_')
                 .replace('person_', '')
                 .replace('_', ' ').title() for col in df.columns]
    
    # Group columns into categories for better organization
    column_groups = {
        'Personal Metrics': [col for col in df.columns if col.startswith('Clinic')],
        'Blood Metrics': [col for col in df.columns if col.startswith('Blood') or
                          col in ['Pglu', 'Trig', 'Ins', 'Cpep', 'Hba1c']],
        'Blood Composition': [col for col in df.columns if col.startswith(('Basophils', 'Eosinophils', 'Hb', 
                                                                           'Lymphocytes', 'Mch', 'Mcv', 
                                                                           'Monocytes', 'Neutrophils', 'Nrbc',
                                                                           'Pcv', 'Plt', 'Rbc', 'Rdw', 'Wbc'))],
        'Demographics': [col for col in df.columns if col.startswith('Md')],
        'Meal Info': [col for col in df.columns if col.startswith('Meal') and 
                      not col.startswith('Meal Carb') and
                      col not in ['Meal Iauc', 'Meal Has Set Meal', 'Meal Set Meal', 'Meal Study']],
        'Previous Meal': [col for col in df.columns if col.startswith(('Previous Meal', 'Meal Carb'))],
        'Activity': [col for col in df.columns if col.startswith('Activity')],
        'Sleep': [col for col in df.columns if col.startswith('Sleep')],
        'Study Info': [col for col in df.columns if col in ['Meal Study', 'Username', 'Meal Has Set Meal', 'Meal Set Meal']],
        'Outcomes': [col for col in df.columns if col in ['Meal Iauc', 'Trig Rise 6h', 'Cpep Rise 1h']]
    }
    
    # Function to check for missing values
    def check_missing(dataframe):
        missing = dataframe.isnull().sum()
        missing_percent = (dataframe.isnull().sum() / len(dataframe)) * 100
        missing_info = pd.DataFrame({'Count': missing, 'Percent': missing_percent})
        missing_info = missing_info[missing_info['Count'] > 0].sort_values('Count', ascending=False)
        return missing_info
    
    # Round numeric values for better readability
    for col in df.select_dtypes(include=['float']).columns:
        df[col] = df[col].round(2)
    
    # Create a summary of the dataset
    summary = {
        'rows': df.shape[0],
        'columns': df.shape[1],
        'missing_data': check_missing(df),
        'column_groups': column_groups,
        'dtypes': df.dtypes.value_counts(),
        'memory_usage': df.memory_usage(deep=True).sum() / 1024**2  # in MB
    }
    
    return df, summary

def save_formatted_data(df, output_dir, column_groups, formats=None):
    """
    Save the formatted data in various formats
    
    Parameters:
    df (pd.DataFrame): The DataFrame to save
    output_dir (str): Directory to save the output files
    column_groups (dict): Dictionary of column groups for Excel sheets
    formats (list): List of formats to save (default: all)
    """
    if formats is None:
        formats = ['csv', 'excel', 'html', 'json']
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate timestamp for file names
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Save in CSV format
    if 'csv' in formats:
        csv_path = os.path.join(output_dir, f'meals_data_formatted_{timestamp}.csv')
        df.to_csv(csv_path, index=True)
        print(f"Saved CSV file to: {csv_path}")
    
    # Save in Excel format
    if 'excel' in formats:
        excel_path = os.path.join(output_dir, f'meals_data_formatted_{timestamp}.xlsx')
        
        # Create a writer object
        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            # Write data to the main sheet
            df.to_excel(writer, sheet_name='MealsData', index=True)
            
            # Create a summary sheet
            summary_df = pd.DataFrame({
                'Category': ['Total Rows', 'Total Columns', 'File Created'],
                'Value': [df.shape[0], df.shape[1], datetime.now().strftime('%Y-%m-%d %H:%M:%S')]
            })
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
            
            # Create sheets for each column group
            for group, cols in column_groups.items():
                if cols:  # Only create sheet if group has columns
                    group_df = df[cols].copy()
                    sheet_name = group.replace(' ', '_')[:31]  # Excel sheet names limited to 31 chars
                    group_df.to_excel(writer, sheet_name=sheet_name, index=True)
        
        print(f"Saved Excel file to: {excel_path}")
    
    # Save in HTML format
    if 'html' in formats:
        html_path = os.path.join(output_dir, f'meals_data_formatted_{timestamp}.html')
        
        # Create HTML content using simple string concatenation
        html_content = "<!DOCTYPE html>\n"
        html_content += "<html lang='en'>\n"
        html_content += "<head>\n"
        html_content += "    <meta charset='UTF-8'>\n"
        html_content += "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n"
        html_content += "    <title>Formatted Meals Data</title>\n"
        html_content += "    <style>\n"
        html_content += "        body { font-family: Arial, sans-serif; margin: 20px; }\n"
        html_content += "        h1 { color: #2c3e50; }\n"
        html_content += "        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }\n"
        html_content += "        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\n"
        html_content += "        th { background-color: #f2f2f2; }\n"
        html_content += "        tr:nth-child(even) { background-color: #f9f9f9; }\n"
        html_content += "        .container { margin-bottom: 30px; }\n"
        html_content += "    </style>\n"
        html_content += "</head>\n"
        html_content += "<body>\n"
        html_content += "    <h1>Formatted Meals Data</h1>\n"
        html_content += "    <div class='container'>\n"
        html_content += "        <h2>Dataset Summary</h2>\n"
        html_content += f"        <p>Total rows: {df.shape[0]}</p>\n"
        html_content += f"        <p>Total columns: {df.shape[1]}</p>\n"
        html_content += f"        <p>Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>\n"
        html_content += "    </div>\n"
        
        # Add the full dataset table
        html_content += "    <div class='container'>\n"
        html_content += "        <h2>Full Dataset (First 50 rows)</h2>\n"
        html_content += df.head(50).to_html(classes='dataframe')
        html_content += "    </div>\n"
        
        # Add tables for each column group
        for group, cols in column_groups.items():
            if cols:  # Only create table if group has columns
                html_content += f"    <div class='container'>\n"
                html_content += f"        <h2>{group}</h2>\n"
                html_content += df[cols].head(10).to_html(classes='dataframe')
                html_content += "    </div>\n"
        
        html_content += "</body>\n"
        html_content += "</html>"
        
        # Write the HTML content to file
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"Saved HTML file to: {html_path}")
    
    # Save in JSON format
    if 'json' in formats:
        json_path = os.path.join(output_dir, f'meals_data_formatted_{timestamp}.json')
        df.to_json(json_path, orient='records', indent=4)
        print(f"Saved JSON file to: {json_path}")

def generate_data_profile(df, output_dir, column_groups):
    """
    Generate a simple data profile with visualizations
    
    Parameters:
    df (pd.DataFrame): The DataFrame to analyze
    output_dir (str): Directory to save the output files
    column_groups (dict): Dictionary of column groups
    """
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    profile_dir = os.path.join(output_dir, f'data_profile_{timestamp}')
    os.makedirs(profile_dir, exist_ok=True)
    
    print(f"Generating data profile in: {profile_dir}")
    
    # Set the plot style - handle version differences
    try:
        plt.style.use('seaborn-v0_8')
    except:
        plt.style.use('seaborn')
    
    # Define key metrics - make sure they exist in the dataframe
    all_key_metrics = ['Clinic Weight', 'Clinic Height', 'Clinic Bmi', 'Md Age', 
                     'Meal Calories', 'Meal Carbohydrate', 'Meal Fat', 'Meal Protein', 
                     'Meal Iauc']
    
    key_metrics = [metric for metric in all_key_metrics if metric in df.columns]
    
    # 1. Generate distributions of key metrics
    for metric in key_metrics:
        plt.figure(figsize=(10, 6))
        sns.histplot(df[metric].dropna(), kde=True)
        plt.title(f'Distribution of {metric}')
        plt.tight_layout()
        plt.savefig(os.path.join(profile_dir, f'{metric.replace(" ", "_")}_distribution.png'))
        plt.close()
    
    # 2. Generate correlation heatmap for key metrics
    try:
        plt.figure(figsize=(12, 10))
        correlation_matrix = df[key_metrics].corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f')
        plt.title('Correlation Matrix of Key Metrics')
        plt.tight_layout()
        plt.savefig(os.path.join(profile_dir, 'correlation_heatmap.png'))
        plt.close()
    except Exception as e:
        print(f"Warning: Could not generate correlation heatmap: {e}")
    
    # 3. Generate box plots by gender
    if 'Md Sex' in df.columns:
        for metric in key_metrics:
            if metric != 'Md Sex':
                plt.figure(figsize=(10, 6))
                sns.boxplot(x='Md Sex', y=metric, data=df)
                plt.title(f'{metric} by Sex')
                plt.tight_layout()
                plt.savefig(os.path.join(profile_dir, f'{metric.replace(" ", "_")}_by_sex.png'))
                plt.close()
    
    # 4. Create a scatter plot of meal composition vs outcome
    if 'Meal Carbohydrate' in df.columns and 'Meal Iauc' in df.columns and 'Md Sex' in df.columns:
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x='Meal Carbohydrate', y='Meal Iauc', hue='Md Sex', data=df)
        plt.title('Meal Carbohydrate vs IAUC by Sex')
        plt.tight_layout()
        plt.savefig(os.path.join(profile_dir, 'carb_vs_iauc.png'))
        plt.close()
    
    print(f"Data profile generated with visualizations in: {profile_dir}")
    
    # Generate an HTML report
    html_path = os.path.join(output_dir, f'data_profile_report_{timestamp}.html')
    
    # Create HTML content
    html_content = "<!DOCTYPE html>\n"
    html_content += "<html lang='en'>\n"
    html_content += "<head>\n"
    html_content += "    <meta charset='UTF-8'>\n"
    html_content += "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n"
    html_content += "    <title>Meals Data Profile</title>\n"
    html_content += "    <style>\n"
    html_content += "        body { font-family: Arial, sans-serif; margin: 20px; }\n"
    html_content += "        h1, h2 { color: #2c3e50; }\n"
    html_content += "        .stats-container { display: flex; flex-wrap: wrap; }\n"
    html_content += "        .stat-card { width: 200px; padding: 15px; margin: 10px; background-color: #f8f9fa; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n"
    html_content += "        .stat-value { font-size: 24px; font-weight: bold; color: #3498db; }\n"
    html_content += "        .image-gallery { display: flex; flex-wrap: wrap; justify-content: center; }\n"
    html_content += "        .image-card { margin: 15px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 400px; }\n"
    html_content += "        .image-card img { width: 100%; height: auto; display: block; }\n"
    html_content += "        .image-caption { padding: 10px; background-color: #f8f9fa; text-align: center; }\n"
    html_content += "    </style>\n"
    html_content += "</head>\n"
    html_content += "<body>\n"
    html_content += "    <h1>Meals Data Profile</h1>\n"
    html_content += f"    <p>Report generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>\n"
    
    # Add dataset summary
    missing_pct = (df.isnull().sum().sum() / (df.shape[0] * df.shape[1]) * 100)
    file_size = df.memory_usage(deep=True).sum() / 1024**2
    
    html_content += "    <h2>Dataset Summary</h2>\n"
    html_content += "    <div class='stats-container'>\n"
    html_content += "        <div class='stat-card'>\n"
    html_content += "            <div class='stat-label'>Total Rows</div>\n"
    html_content += f"            <div class='stat-value'>{df.shape[0]}</div>\n"
    html_content += "        </div>\n"
    html_content += "        <div class='stat-card'>\n"
    html_content += "            <div class='stat-label'>Total Columns</div>\n"
    html_content += f"            <div class='stat-value'>{df.shape[1]}</div>\n"
    html_content += "        </div>\n"
    html_content += "        <div class='stat-card'>\n"
    html_content += "            <div class='stat-label'>Missing Values</div>\n"
    html_content += f"            <div class='stat-value'>{missing_pct:.1f}%</div>\n"
    html_content += "        </div>\n"
    html_content += "        <div class='stat-card'>\n"
    html_content += "            <div class='stat-label'>File Size</div>\n"
    html_content += f"            <div class='stat-value'>{file_size:.2f} MB</div>\n"
    html_content += "        </div>\n"
    html_content += "    </div>\n"
    
    # Add distribution images
    html_content += "    <h2>Key Distributions</h2>\n"
    html_content += "    <div class='image-gallery'>\n"
    
    for metric in key_metrics:
        img_path = f'{metric.replace(" ", "_")}_distribution.png'
        if os.path.exists(os.path.join(profile_dir, img_path)):
            html_content += "        <div class='image-card'>\n"
            html_content += f"            <img src='{os.path.join('data_profile_' + timestamp, img_path)}' alt='Distribution of {metric}'>\n"
            html_content += f"            <div class='image-caption'>Distribution of {metric}</div>\n"
            html_content += "        </div>\n"
    
    html_content += "    </div>\n"
    
    # Add correlation heatmap
    heatmap_path = 'correlation_heatmap.png'
    if os.path.exists(os.path.join(profile_dir, heatmap_path)):
        html_content += "    <h2>Correlations</h2>\n"
        html_content += "    <div class='image-gallery'>\n"
        html_content += "        <div class='image-card'>\n"
        html_content += f"            <img src='{os.path.join('data_profile_' + timestamp, heatmap_path)}' alt='Correlation Heatmap'>\n"
        html_content += "            <div class='image-caption'>Correlation Matrix of Key Metrics</div>\n"
        html_content += "        </div>\n"
        html_content += "    </div>\n"
    
    # Add by-sex boxplots
    if 'Md Sex' in df.columns:
        html_content += "    <h2>Metrics by Sex</h2>\n"
        html_content += "    <div class='image-gallery'>\n"
        
        for metric in key_metrics:
            if metric != 'Md Sex':
                img_path = f'{metric.replace(" ", "_")}_by_sex.png'
                if os.path.exists(os.path.join(profile_dir, img_path)):
                    html_content += "        <div class='image-card'>\n"
                    html_content += f"            <img src='{os.path.join('data_profile_' + timestamp, img_path)}' alt='{metric} by Sex'>\n"
                    html_content += f"            <div class='image-caption'>{metric} by Sex</div>\n"
                    html_content += "        </div>\n"
        
        html_content += "    </div>\n"
    
    # Add scatter plot
    scatter_path = 'carb_vs_iauc.png'
    if os.path.exists(os.path.join(profile_dir, scatter_path)):
        html_content += "    <h2>Key Relationships</h2>\n"
        html_content += "    <div class='image-gallery'>\n"
        html_content += "        <div class='image-card'>\n"
        html_content += f"            <img src='{os.path.join('data_profile_' + timestamp, scatter_path)}' alt='Carbohydrate vs IAUC'>\n"
        html_content += "            <div class='image-caption'>Meal Carbohydrate vs IAUC by Sex</div>\n"
        html_content += "        </div>\n"
        html_content += "    </div>\n"
    
    # Close HTML
    html_content += "</body>\n"
    html_content += "</html>"
    
    # Write HTML to file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Data profile HTML report saved to: {html_path}")

def main():
    """
    Main function to run the entire process
    """
    # Set the input and output paths - adjust these to your file location
    input_path = './sample_meals.csv'  # Change this to your file path
    output_dir = './formatted_data'
    
    # Load and clean the data
    df, summary = load_and_clean_meals_data(input_path)
    
    if df is not None and summary is not None:
        # Extract column groups from summary
        column_groups = summary['column_groups']
        
        # Print a summary of the data
        print("\nData Summary:")
        print(f"Rows: {summary['rows']}")
        print(f"Columns: {summary['columns']}")
        print(f"Memory usage: {summary['memory_usage']:.2f} MB")
        print("\nColumn groups:")
        for group, cols in column_groups.items():
            print(f"  {group}: {len(cols)} columns")
        
        print("\nMissing data summary:")
        if not summary['missing_data'].empty:
            print(summary['missing_data'].head(10))
        else:
            print("No missing data found")
        
        # Save the formatted data
        save_formatted_data(df, output_dir, column_groups, formats=['csv', 'excel', 'html', 'json'])
        
        # Generate a data profile
        generate_data_profile(df, output_dir, column_groups)
        
        print("\nData processing completed successfully!")
        print(f"All output files are saved in: {os.path.abspath(output_dir)}")
    else:
        print("Failed to process the data. Please check the file path and try again.")

if __name__ == "__main__":
    main()
