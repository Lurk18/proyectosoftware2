# plan_de_pruebas/process.py
import subprocess

def run_curl_command(command):
    try:
        # Ejecuta el comando cURL y captura la salida estándar y de error
        result = subprocess.run(command, capture_output=True, text=True, check=True, shell=True)
        print("Salida:$", result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar cURL: {e}")
        print("Error:", e.stderr)

# Ejemplo de solicitud GET
command_get = "curl https://www.ejemplo.com"
run_curl_command(command_get)

# Ejemplo de solicitud POST con datos
command_post = "curl -X POST -d 'param1=valor1&param2=valor2' https://ejemplo.com/api"
run_curl_command(command_post)

def execute_test_plan(test_plan):
    results = []
    for test_case in test_plan['test_cases']:
        result = run_test_case(test_case)
        results.append(result)
    return results

