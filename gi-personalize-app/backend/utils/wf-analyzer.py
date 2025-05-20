import json
import os
import argparse
from flask import Flask, jsonify, request, render_template_string
import networkx as nx
from collections import defaultdict

app = Flask(__name__)

# HTML template for workflow visualization
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workflow Visualization</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        #cy {
            width: 100%;
            height: 85vh;
            background-color: white;
            border: 1px solid #ddd;
        }
        .container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
        }
        .info-panel {
            background-color: white;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .task-details {
            max-height: 300px;
            overflow: auto;
            background-color: #f9f9f9;
            padding: 10px;
            border: 1px solid #eee;
            margin-top: 10px;
            font-family: monospace;
            white-space: pre-wrap;
        }
        .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 10px 0;
        }
        .legend-item {
            display: flex;
            align-items: center;
            margin-right: 15px;
        }
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            border: 1px solid #333;
        }
        .controls {
            margin: 10px 0;
        }
        .controls button {
            padding: 5px 10px;
            margin-right: 10px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Workflow Visualization: {{ workflow_name }}</h1>
        
        <div class="info-panel">
            <h2>Workflow Information</h2>
            <p><strong>ID:</strong> {{ workflow_id }}</p>
            <p><strong>Created:</strong> {{ created_date }}</p>
            <p><strong>Last Updated:</strong> {{ last_updated }}</p>
            <p><strong>Total Tasks:</strong> {{ task_count }}</p>
            
            <div class="legend">
                <h3>Legend:</h3>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #8FCACA;"></div>
                    <span>Operation Task</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #FFA62B;"></div>
                    <span>Automatic Task</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #82B366;"></div>
                    <span>Start</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #D5E8D4;"></div>
                    <span>End</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: white;"></div>
                    <span>Other Task Types</span>
                </div>
                <div class="legend-item">
                    <div style="height: 2px; width: 20px; background-color: green; margin-right: 5px;"></div>
                    <span>Success Transition</span>
                </div>
                <div class="legend-item">
                    <div style="height: 2px; width: 20px; background-color: red; margin-right: 5px;"></div>
                    <span>Error/Failure Transition</span>
                </div>
            </div>
            
            <div class="controls">
                <button id="fit">Fit View</button>
                <button id="grid">Grid Layout</button>
                <button id="circle">Circle Layout</button>
                <button id="breadthfirst">Hierarchical Layout</button>
            </div>
        </div>
        
        <div id="cy"></div>
        
        <div class="info-panel">
            <h2>Selected Task Details</h2>
            <div id="taskDetails" class="task-details">Click on a task to see details</div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const cy = cytoscape({
                container: document.getElementById('cy'),
                elements: {{ elements|safe }},
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(label)',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'background-color': 'data(color)',
                            'text-wrap': 'wrap',
                            'text-max-width': '100px',
                            'width': 'data(width)',
                            'height': 'data(height)',
                            'border-width': 1,
                            'border-color': '#333',
                            'font-size': '10px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': 'data(color)',
                            'target-arrow-color': 'data(color)',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier',
                            'label': 'data(label)',
                            'font-size': '8px',
                            'text-background-opacity': 1,
                            'text-background-color': 'white',
                            'text-background-padding': '2px'
                        }
                    },
                    {
                        selector: ':selected',
                        style: {
                            'border-width': 3,
                            'border-color': '#333',
                            'border-style': 'dashed'
                        }
                    }
                ],
                layout: {
                    name: 'preset',
                    padding: 30
                }
            });
            
            // Add click event to nodes to display task details
            cy.on('tap', 'node', function(evt) {
                const node = evt.target;
                const taskDetails = document.getElementById('taskDetails');
                taskDetails.innerHTML = node.data('details');
            });
            
            // Button event handlers
            document.getElementById('fit').addEventListener('click', function() {
                cy.fit();
            });
            
            document.getElementById('grid').addEventListener('click', function() {
                cy.layout({ name: 'grid', padding: 30 }).run();
            });
            
            document.getElementById('circle').addEventListener('click', function() {
                cy.layout({ name: 'circle', padding: 30 }).run();
            });
            
            document.getElementById('breadthfirst').addEventListener('click', function() {
                cy.layout({ 
                    name: 'breadthfirst', 
                    directed: true,
                    padding: 30,
                    spacingFactor: 1.5
                }).run();
            });
            
            // Initial layout
            cy.layout({ 
                name: 'breadthfirst', 
                directed: true,
                padding: 30,
                spacingFactor: 1.5
            }).run();
        });
    </script>
</body>
</html>
'''

class WorkflowAnalyzer:
    def __init__(self, json_file):
        """Initialize the analyzer with a workflow JSON file"""
        try:
            with open(json_file, 'r') as f:
                self.workflow_data = json.load(f)
        except FileNotFoundError:
            print(f"Error: File {json_file} not found")
            raise
        except json.JSONDecodeError:
            print(f"Error: File {json_file} is not a valid JSON file")
            raise
        
        self.workflow_id = self.workflow_data.get('_id', 'N/A')
        self.workflow_name = self.workflow_data.get('name', 'Unnamed Workflow')
        self.created_date = self.workflow_data.get('created', {}).get('$date', 'N/A')
        self.last_updated = self.workflow_data.get('last_updated', {}).get('$date', 'N/A')
        
        self.tasks = self.workflow_data.get('tasks', {})
        self.transitions = self.workflow_data.get('transitions', {})
        
        # Build a directed graph for the workflow
        self.graph = nx.DiGraph()
        self._build_graph()
    
    def _build_graph(self):
        """Build a directed graph from the workflow data"""
        # Add all tasks as nodes
        for task_id, task_data in self.tasks.items():
            self.graph.add_node(task_id, **task_data)
        
        # Add all transitions as edges
        for source_id, transitions in self.transitions.items():
            for target_id, transition_data in transitions.items():
                self.graph.add_edge(source_id, target_id, **transition_data)
    
    def get_cytoscape_elements(self):
        """Convert workflow graph to Cytoscape elements"""
        elements = []
        
        # Add nodes
        for task_id, task_data in self.tasks.items():
            task_type = task_data.get('type', 'unknown')
            task_name = task_data.get('name', 'Unnamed Task')
            task_summary = task_data.get('summary', '')
            
            # Determine node color based on task type
            if task_id == 'workflow_start':
                color = '#82B366'  # Green for start
            elif task_id == 'workflow_end':
                color = '#D5E8D4'  # Light green for end
            elif task_type == 'operation':
                color = '#8FCACA'  # Light blue for operation
            elif task_type == 'automatic':
                color = '#FFA62B'  # Orange for automatic
            else:
                color = 'white'
            
            # Format task details for display
            details = json.dumps(task_data, indent=2, sort_keys=True)
            
            # Create node
            node = {
                'data': {
                    'id': task_id,
                    'label': f"{task_name}\n({task_id})\n{task_summary}",
                    'color': color,
                    'width': 120,
                    'height': 60,
                    'details': details
                },
                'position': {
                    'x': float(task_data.get('x', 0)) * 1000,
                    'y': float(task_data.get('y', 0)) * 1000
                }
            }
            elements.append(node)
        
        # Add edges
        for source_id, transitions in self.transitions.items():
            for target_id, transition_data in transitions.items():
                transition_type = transition_data.get('type', 'standard')
                transition_state = transition_data.get('state', 'unknown')
                
                # Determine edge color based on transition state
                if transition_state == 'success':
                    color = 'green'
                elif transition_state in ['failure', 'error']:
                    color = 'red'
                else:
                    color = 'gray'
                
                # Create edge
                edge = {
                    'data': {
                        'id': f"{source_id}-{target_id}",
                        'source': source_id,
                        'target': target_id,
                        'label': transition_state,
                        'color': color
                    }
                }
                elements.append(edge)
        
        return elements
    
    def generate_html(self):
        """Generate HTML visualization of the workflow"""
        elements_json = json.dumps(self.get_cytoscape_elements())
        
        # Handle the case when running outside Flask app context
        try:
            # Try using Flask's render_template_string if in app context
            from flask import current_app
            current_app._get_current_object()  # Will raise RuntimeError if outside app context
            html = render_template_string(
                HTML_TEMPLATE,
                workflow_name=self.workflow_name,
                workflow_id=self.workflow_id,
                created_date=self.created_date,
                last_updated=self.last_updated,
                task_count=len(self.tasks),
                elements=elements_json
            )
        except (RuntimeError, ImportError):
            # Fall back to manual template rendering if not in app context
            html = render_template_without_flask(
                HTML_TEMPLATE,
                workflow_name=self.workflow_name,
                workflow_id=self.workflow_id,
                created_date=self.created_date,
                last_updated=self.last_updated,
                task_count=len(self.tasks),
                elements=elements_json
            )
        
        return html
    
    def get_task_summary(self):
        """Generate a detailed summary of all tasks in the workflow"""
        summary = {
            "workflow_name": self.workflow_name,
            "workflow_id": self.workflow_id,
            "task_count": len(self.tasks),
            "tasks": {}
        }
        
        for task_id, task_data in self.tasks.items():
            task_summary = {
                "name": task_data.get('name', 'Unnamed Task'),
                "type": task_data.get('type', 'unknown'),
                "summary": task_data.get('summary', ''),
                "description": task_data.get('description', ''),
                "app": task_data.get('app', ''),
                "actor": task_data.get('actor', ''),
                "variables": task_data.get('variables', {}),
                "outgoing_transitions": [],
                "incoming_transitions": []
            }
            
            # Add outgoing transitions
            if task_id in self.transitions:
                for target_id, transition_data in self.transitions[task_id].items():
                    task_summary["outgoing_transitions"].append({
                        "target_task": target_id,
                        "target_name": self.tasks.get(target_id, {}).get('name', 'Unknown'),
                        "type": transition_data.get('type', 'standard'),
                        "state": transition_data.get('state', 'unknown')
                    })
            
            # Find incoming transitions
            for source_id, transitions in self.transitions.items():
                if task_id in transitions:
                    transition_data = transitions[task_id]
                    task_summary["incoming_transitions"].append({
                        "source_task": source_id,
                        "source_name": self.tasks.get(source_id, {}).get('name', 'Unknown'),
                        "type": transition_data.get('type', 'standard'),
                        "state": transition_data.get('state', 'unknown')
                    })
            
            summary["tasks"][task_id] = task_summary
        
        return summary
    
    def get_ansible_friendly_data(self):
        """Generate data that would be helpful for creating an Ansible script"""
        ansible_data = {
            "workflow_name": self.workflow_name,
            "workflow_id": self.workflow_id,
            "task_sequences": [],
            "variable_mappings": {},
            "operation_tasks": [],
            "automatic_tasks": []
        }
        
        # Find possible execution paths
        start_node = 'workflow_start'
        end_node = 'workflow_end'
        
        # Try to find all paths from start to end
        if start_node in self.graph and end_node in self.graph:
            try:
                all_paths = list(nx.all_simple_paths(self.graph, start_node, end_node))
                for i, path in enumerate(all_paths):
                    path_info = {
                        "path_id": i,
                        "path": path,
                        "tasks": []
                    }
                    
                    for task_id in path:
                        task_data = self.tasks.get(task_id, {})
                        path_info["tasks"].append({
                            "id": task_id,
                            "name": task_data.get('name', 'Unnamed Task'),
                            "type": task_data.get('type', 'unknown'),
                            "app": task_data.get('app', ''),
                            "variables": task_data.get('variables', {})
                        })
                    
                    ansible_data["task_sequences"].append(path_info)
            except nx.NetworkXNoPath:
                # No path exists between start and end
                ansible_data["task_sequences"] = []
        
        # Collect variable mappings across tasks
        for task_id, task_data in self.tasks.items():
            variables = task_data.get('variables', {})
            
            # Track incoming variables
            if 'incoming' in variables:
                for var_name, var_value in variables['incoming'].items():
                    if var_name not in ansible_data["variable_mappings"]:
                        ansible_data["variable_mappings"][var_name] = []
                    
                    ansible_data["variable_mappings"][var_name].append({
                        "task_id": task_id,
                        "task_name": task_data.get('name', 'Unnamed Task'),
                        "value": var_value
                    })
            
            # Track outgoing variables
            if 'outgoing' in variables:
                for var_name, var_value in variables['outgoing'].items():
                    if var_name not in ansible_data["variable_mappings"]:
                        ansible_data["variable_mappings"][var_name] = []
                    
                    ansible_data["variable_mappings"][var_name].append({
                        "task_id": task_id,
                        "task_name": task_data.get('name', 'Unnamed Task'),
                        "value": var_value
                    })
            
            # Categorize tasks by type
            if task_data.get('type') == 'operation':
                ansible_data["operation_tasks"].append({
                    "id": task_id,
                    "name": task_data.get('name', 'Unnamed Task'),
                    "app": task_data.get('app', ''),
                    "summary": task_data.get('summary', ''),
                    "variables": task_data.get('variables', {})
                })
            elif task_data.get('type') == 'automatic':
                ansible_data["automatic_tasks"].append({
                    "id": task_id,
                    "name": task_data.get('name', 'Unnamed Task'),
                    "app": task_data.get('app', ''),
                    "summary": task_data.get('summary', ''),
                    "variables": task_data.get('variables', {})
                })
        
        return ansible_data

# API routes
@app.route('/')
def index():
    """Display the main page with instructions"""
    return """
    <h1>Workflow Analyzer API</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><a href="/visualize">/visualize</a> - Generate HTML visualization of the workflow</li>
        <li><a href="/api/tasks">/api/tasks</a> - Get summary of all tasks</li>
        <li><a href="/api/ansible">/api/ansible</a> - Get Ansible-friendly data</li>
        <li><a href="/api/workflow">/api/workflow</a> - Get the full workflow data</li>
    </ul>
    """

@app.route('/visualize')
def visualize():
    """Generate and return HTML visualization of the workflow"""
    analyzer = app.config['ANALYZER']
    return analyzer.generate_html()

@app.route('/api/tasks')
def get_tasks():
    """Return a summary of all tasks in JSON format"""
    analyzer = app.config['ANALYZER']
    return jsonify(analyzer.get_task_summary())

@app.route('/api/ansible')
def get_ansible_data():
    """Return Ansible-friendly data in JSON format"""
    analyzer = app.config['ANALYZER']
    return jsonify(analyzer.get_ansible_friendly_data())

@app.route('/api/workflow')
def get_workflow():
    """Return the full workflow data in JSON format"""
    analyzer = app.config['ANALYZER']
    return jsonify(analyzer.workflow_data)

def render_template_without_flask(template_string, **context):
    """Simple template rendering function that doesn't require Flask"""
    result = template_string
    for key, value in context.items():
        result = result.replace("{{ " + key + " }}", str(value))
        # Also replace {% raw %} tags if present
        result = result.replace("{% raw %}", "").replace("{% endraw %}", "")
    return result

def generate_workflow_html(json_file, output_file=None):
    """Generate HTML visualization of a workflow from a JSON file"""
    analyzer = WorkflowAnalyzer(json_file)
    html = analyzer.generate_html()
    
    if output_file:
        with open(output_file, 'w') as f:
            f.write(html)
        print(f"Generated HTML visualization: {output_file}")
    
    return html

def print_workflow_summary(json_file):
    """Print a summary of the workflow to the console"""
    analyzer = WorkflowAnalyzer(json_file)
    task_summary = analyzer.get_task_summary()
    
    print(f"Workflow: {task_summary['workflow_name']} (ID: {task_summary['workflow_id']})")
    print(f"Total Tasks: {task_summary['task_count']}")
    print("\n" + "="*80)
    
    for task_id, task_data in task_summary['tasks'].items():
        print(f"\nTask: {task_data['name']} (ID: {task_id})")
        print(f"  Type: {task_data['type']}")
        print(f"  App: {task_data['app']}")
        print(f"  Summary: {task_data['summary']}")
        
        if task_data['outgoing_transitions']:
            print("  Outgoing Transitions:")
            for transition in task_data['outgoing_transitions']:
                print(f"    → {transition['target_name']} (ID: {transition['target_task']}) [{transition['state']}]")
        
        if task_data['incoming_transitions']:
            print("  Incoming Transitions:")
            for transition in task_data['incoming_transitions']:
                print(f"    ← {transition['source_name']} (ID: {transition['source_task']}) [{transition['state']}]")

def run_api_server(json_file, host='0.0.0.0', port=5000):
    """Run the Flask API server"""
    analyzer = WorkflowAnalyzer(json_file)
    app.config['ANALYZER'] = analyzer
    print(f"Starting API server at http://{host}:{port}")
    print(f"Visit http://{host}:{port}/visualize to see the workflow visualization")
    
    # Ensure we're using the Flask app's context
    with app.app_context():
        app.run(host=host, port=port, debug=False)

def main():
    """Main function to handle command-line arguments"""
    parser = argparse.ArgumentParser(description='Analyze and visualize workflow JSON files')
    parser.add_argument('json_file', help='Path to the workflow JSON file')
    parser.add_argument('--html', help='Generate HTML visualization to the specified output file')
    parser.add_argument('--summary', action='store_true', help='Print workflow summary to console')
    parser.add_argument('--serve', action='store_true', help='Start API server')
    parser.add_argument('--port', type=int, default=5000, help='Port for the API server (default: 5000)')
    
    args = parser.parse_args()
    
    # Check if the file exists
    if not os.path.exists(args.json_file):
        print(f"Error: File {args.json_file} not found")
        return 1
    
    try:
        if args.html:
            generate_workflow_html(args.json_file, args.html)
        
        if args.summary:
            print_workflow_summary(args.json_file)
        
        if args.serve:
            run_api_server(args.json_file, port=args.port)
        
        # If no action specified, default to printing summary
        if not (args.html or args.summary or args.serve):
            print_workflow_summary(args.json_file)
            
        return 0
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1

if __name__ == '__main__':
    main()
